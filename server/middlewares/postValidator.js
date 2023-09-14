const { check, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const tmp_dir = path.join(__dirname, '../uploads_tmp');
// const dir = path.join(__dirname, '../uploads');
const dir = path.join(__dirname, '../../admin/public/uploads'); //경로를 변경. 직접 이미지가 public에 저장되게

exports.postValidator = [
    check('title').trim().not().isEmpty().withMessage('제목을 입력하는데 에러가 발생했습니다.'),
    check('content').trim().not().isEmpty().withMessage('내용을 입력하는데 에러가 발생했습니다.'),
    check('meta').trim().not().isEmpty().withMessage('메타태그를 입력하는데 에러가 발생했습니다.'),
    check('tags')
        .isArray()
        .withMessage('Tags must be array of strings!')
        .custom((tags) => {
            for(let t of tags) {
                if( typeof t !== 'string') {
                    throw Error('태그타입이 아닙니다. 태그는 문자열이어야 합니다.');
                }
            }
            return true;
        }),
    check('slug').trim().not().isEmpty().withMessage('슬러그를 입력하는데 에러가 발생했습니다.'),
];    

exports.validate = (req, res, next ) => {
    const error = validationResult(req).array();
    //파일확인
    let files;
    try{
         files = fs.readdirSync(tmp_dir);
    }catch(e){
         files = '';
         return;
    }
    if(error.length) {
        //파일삭제
        if(files.length > 0 ) {
            for(let i=0; i < files.length; i++){
                fs.unlinkSync(tmp_dir+'/'+files[i]);
            }
        }
        return res.status(401).json({ 에러: error[0].msg })
    }
    //파일이동
    if(files.length > 0 ) {
        for(let i=0; i < files.length; i++){
            fs.rename(`${tmp_dir}/${files[i]}`, `${dir}/${files[i]}`, (err)=>{
              return  console.log(err);
            });
        }
    }   
    next();
}