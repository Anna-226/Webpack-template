import * as $ from 'jquery';
import Post from "@models/Post";
//import json from './assets/json';
import logo from './assets/webpack-logo';
//import xml from './assets/data.xml';
//import csv from './assets/data.csv';
import './styles/styles.css';

const post = new Post('Webpack Post Title', logo);

$('pre').addClass('code').html(post.toString());

//console.log('Post to String', post.toString());

/* console.log('json:', json);
console.log('XML:', xml);
console.log('CSV:', csv); */