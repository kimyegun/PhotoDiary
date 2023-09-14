const router = require('express').Router();
const { 
    createPost, 
    deletePost, 
    updatePost, 
    getPost,
    getPosts, 
    getFeaturedPosts,
    searchPost,
    getRelatedPosts,
    uploadImage } = require('../controllers/post');
const { parseData } = require('../middlewares');
const multer = require('../middlewares/multer');
const { postValidator, validate } = require('../middlewares/postValidator');

//쓰기
router.post(
    '/create', 
    multer.single('thumbnail'), 
    parseData,
    postValidator, 
    validate,
    createPost
);

//수정
router.put(
    '/:postId',
    multer.single('thumbnail'), 
    parseData,
    postValidator, 
    validate,
    updatePost    
)

//삭제
router.delete('/:postId', deletePost);

router.get('/single/:slug', getPost);
router.get('/featured-posts', getFeaturedPosts);
router.get('/posts', getPosts);
router.get('/search', searchPost);
router.get('/related-posts/:postId', getRelatedPosts);

//이미지 업로드
// router.post('/upload-image', multer.single('thumbnail'), uploadImage);

module.exports = router