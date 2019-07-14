import './css/index.css';
import './css/black.less';
import './css/white.scss';
import wenjie from './wenjie.js';
// import $ from 'jquery';//第一种方法引入第三方库

{
    let wenjieString="Hello wenjie !"
    document.getElementById('title').innerHTML=wenjieString;
}
wenjie();

$('#title').html('hello wenjie webpack!')
var json =require('../config.json');
document.getElementById("json").innerHTML= json.name;