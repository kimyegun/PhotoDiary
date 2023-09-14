const Post = require('../models/post');
const FeaturedPost = require('../models/featuredPost');
const { isValidObjectId } = require('mongoose');
const fs = require('fs');
const path = require('path');
const post = require('../models/post');
const dir = path.join(__dirname, '../uploads');

const FEATURED_POST_COUNT = 4;

const addToFeaturedPost = async (postId) => {
    const isAlreadyExits = await FeaturedPost.findOne({ post: postId });
    if(isAlreadyExits) return;

    const featuredPost = new FeaturedPost({ post: postId });
    await featuredPost.save();

    const featuredPosts = await FeaturedPost.find({}).sort({ createdAt: -1 });
    featuredPosts.forEach(async (post, index)=>{
        if(index >= FEATURED_POST_COUNT) await FeaturedPost.findByIdAndDelete(post._id);
    })
}

const removeFromFeaturedPost = async (postId) => {
    await FeaturedPost.findOneAndDelete({post: postId})
}

const isFeaturedPost = async (postId) => {
    const post = await FeaturedPost.findOne({ post: postId });
    return post ? true : false;
}

exports.createPost = async (req, res) => {

    let thumbnail = { filename: '', originalname: ''}
    if(req.file){
        thumbnail = {
          filename: req.file.filename,
          originalname: req.file.originalname
       }
    }   
    const { title, content, meta, tags, author, slug, featured } = req.body;
     //slug 확인 
    const isAlreadyExits = await Post.findOne({slug});
    if(isAlreadyExits) return res.status(401).json({ error: 'slug는 유일한 값으로 지정하세요.'})

    const newPost = new Post({ title, content, meta, tags, author, slug, thumbnail });
    await newPost.save();

    //최근 글 등록
    if(featured) await addToFeaturedPost(newPost._id);
    res.json({post: {
        id: newPost._id,
        title,
        content,
        meta,
        slug,
        thumbnail: newPost.thumbnail?.filename,
        author: newPost.author
    }});
}

exports.updatePost = async (req, res) => {
    let newthumbnail = { filename: '', originalname: ''}
    if(req.file){
       newthumbnail = {
          filename: req.file.filename,
          originalname: req.file.originalname
       }
    }   

    const { title, content, meta, tags, author, slug, featured } = req.body;

    const {postId} = req.params;
    if(!isValidObjectId(postId)) 
       return res.status(401).json({ error: '아이디 번호가 없습니다.'});

    const post = await Post.findById(postId)
    if(!post)
      return res.status(401).json({ error: '내용을 찾을 수 없습니다.'});   

    if(newthumbnail.filename) { 
        const {filename} = post.thumbnail;
        if(filename) {
          //파일 삭제
          fs.unlink(dir+"/"+filename, (err)=>{
             if(err){
                console.log("Error: ", err)
              }
          })
        }    
    }
    post.title = title;
    post.content = content;
    post.meta = meta;
    post.tags = tags;
    post.author = author;
    post.slug = slug;
    if(req.file) post.thumbnail = newthumbnail;

    if(featured) await addToFeaturedPost(post._id)
    else await removeFromFeaturedPost(post._id)

    await post.save();
    res.json({
        post: {
            id: post._id,
            title,
            content,
            meta,
            slug,
            thumbnail: post.thumbnail,
            author: post.author,
            featured
        }
    })
}

exports.deletePost = async (req, res) => {
    const {postId} = req.params;
    if(!isValidObjectId(postId)) 
       return res.status(401).json({ error: '아이디 번호가 없습니다.'});

       const post = await Post.findById(postId)
       if(!post)
          return res.status(401).json({ error: '내용을 찾을 수 없습니다.'});

       const {filename} = post.thumbnail;
       if(filename) {
           //파일 삭제
           fs.unlink(dir+"/"+filename, (err)=>{
               if(err){
                  console.log("Error: ", err)
               }
           })
       }    
  
       //db삭제
       await Post.findByIdAndDelete(postId);
       await removeFromFeaturedPost(postId);
       res.json({ 메시지 : "삭제가 정상적으로 실행 되었습니다."});
}

exports.getPost = async (req, res) => {
    const { slug } = req.params;
    if(!slug) 
       return res.status(401).json({ error: 'slug가 없습니다.'});

    const post = await Post.findOne({slug});
    if(!post)
      return res.status(401).json({ error: '게시물을 찾을 수 없습니다.'});  

    const featured = await isFeaturedPost(post._id);
    const { title, content, meta, tags, author, createdAt } = post;  
    res.json({
        post: {
            id: post._id,
            title,
            content,
            meta,
            slug,
            thumbnail: post.thumbnail,
            author,
            tags,
            featured,
            createdAt
        }
    })  
}

exports.getPosts = async (req, res) => {
    const { pageNo = 0, limit = 10 } = req.query;
    
    const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

    const postCount = await Post.countDocuments();
    

    res.json({ 
        posts : posts.map((post)=>({
           id: post._id,
           title: post.title,
           content: post.content,
           meta: post.meta,
           slug: post.slug,
           thumbnail: post.thumbnail?.filename,
           author: post.author,
           createdAt: post.createdAt,
           tags: post.tags
        })),
        postCount
    });
}

exports.getFeaturedPosts = async (req, res) => {
    const featuredPosts = await FeaturedPost.find({})
          .sort({ createdAt: -1 })
          .limit(4)
          .populate('post');

    res.json({ 
        posts: featuredPosts.map((post)=>({
            id: post._id,
            title: post.title,
            meta: post.meta,
            slug: post.slug,
            thumbnail: post.thumbnail?.filename,
            author: post.author 
        }))
    })
} 

exports.searchPost = async (req, res) => {
    const {title} = req.query;
    if(!title.trim()) return res.status(401).json({error: '일치하는 검색 결과가 존재하지 않습니다.'});

    const posts = await Post.find({title: {$regex:title, $options: 'i'}}); //regex: 정규식, options i: 대소문자 구분 X

    res.json({ 
        posts : posts.map((post)=>({
           id: post._id,
           title: post.title,
           content: post.content,
           meta: post.meta,
           slug: post.slug,
           thumbnail: post.thumbnail?.filename,
           author: post.author,
           createdAt: post.createdAt,
           tags: post.tags
        }))
    });
}

exports.getRelatedPosts = async (req, res) => {
    const { postId } = req.params;
    if(!isValidObjectId(postId)) return res.status(401).json({error:'아이디 번호가 없습니다.'});

    const post = await Post.findById(postId);
    if(!post) return res.status(401).json({error:'검색 결과가 존재하지 않습니다.'});

    const relatedPosts = await Post.find({
        tags: {$in: [...post.tags]},
        _id: {$ne: post._id}
    })
    .sort({createdAt: -1}).limit(5);

    const posts = await Post.find({title: {$regex:title, $options: 'i'}}); //regex: 정규식, options i: 대소문자 구분 X

    res.json({ 
        posts : relatedPosts.map((post)=>({
           id: post._id,
           title: post.title,
        //    content: post.content,
           meta: post.meta,
           slug: post.slug,
           thumbnail: post.thumbnail?.filename,
           author: post.author,
        //    createdAt: post.createdAt,
           tags: post.tags
        }))
    });
}

exports.uploadImage = async (req, res) => {
    const {file} = req;
    if(!file) return res.status(401).json({error:'파일이 존재하지 않습니다.'});

    let thumbnail = { filename: '', originalname: ''}
    if(req.file){
        thumbnail = {
          filename: req.file.filename,
          originalname: req.file.originalname
       }
    }  

    res.status(201).json({image: thumbnail});
}