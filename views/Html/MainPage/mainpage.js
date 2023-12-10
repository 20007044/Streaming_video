var leftarrow=document.getElementById('leftarrow');
var rightarrow=document.getElementById('rightarrow');
var leftarrow2=document.getElementById('leftarrow2');
var rightarrow2=document.getElementById('rightarrow2');


var shows=document.getElementById('shows');
var shows2=document.getElementById('shows2');
var popular=document.querySelector('.popularcontainer');
var popular2=document.querySelector('.popularcontainer2');

var leftslider=document.getElementById('leftslider');
var leftslider2=document.getElementById('leftslider2');
var rightslider=document.getElementById('rightslider');
var rightslider2=document.getElementById('rightslider2');

var leftswipe=document.querySelector('.leftswipe');
var rightswipe=document.querySelector('.rightswipe');
var sliderimage=document.querySelector('#sliderimage');

var title=document.querySelector('#title');
var description=document.querySelector('#description');

var images=['../Images/slider1.png','../Images/slider2.png','../Images/slider3.png','../Images/slider4.png'];
var imagesCount=images.length;
var imageIndex=0;

var details=[
    show0={
        'title':'Robots',
        'description':'Charles is a womanizer while Elaine is a gold digger. The duo learn humanity when forced to team up and pursue robot doubles of themselves'
    },
    show1={
        'title':'Creed III',
        'description':'After dominating the boxing world, Adonis Creed has been thriving in his career and family life. But now he puts his future on the line to battle a fighter and former friend who has absolutely nothing to lose…and everything to gain.'
    },
    show2={
        'title':'After Everything',
        'description':"The fifth and final installment of the AFTER franchise sees the emotional culmination of Hardin and Tessa's timeless romance. For a couple that's been through it all, only one question remains: what happens After Everything?"
    },
    show3={
        'title':'Red White & Royal Blue',
        'description':'Based on the New York Times bestseller, Red, White & Royal Blue centers around Alex, the president’s son, and Britain’s Prince Henry whose long-running feud threatens to drive a wedge in U.S./British relations. When the rivals are forced into a staged truce, their icy relationship begins to thaw and the friction between them sparks something deeper than they ever expected.'
    },
]
title.innerHTML=details[imageIndex].title;
description.innerHTML=details[imageIndex].description;
leftswipe.addEventListener('click',()=>{
    if(imageIndex<1)
    return;
    imageIndex--;
    if(imageIndex<0)
     imageIndex=0;
    sliderimage.src=images[imageIndex];  
    title.innerHTML=details[imageIndex].title;
    description.innerHTML=details[imageIndex].description;
});
rightswipe.addEventListener('click',()=>{
    if(imageIndex>imagesCount-1)
    return;
    imageIndex++;
    if(imageIndex>imagesCount-1)
    imageIndex=imagesCount-1;
    sliderimage.src=images[imageIndex];
    title.innerHTML=details[imageIndex].title;
    description.innerHTML=details[imageIndex].description;
});
var x=0;
let clickTimer;
leftarrow.addEventListener('mousedown',()=>{
    clickTimer=setInterval(()=>{ x+=20;
        shows.style.transform=`translateX(${x}px)`;},50);
        console.log(x);
});
leftarrow.addEventListener('mouseup',()=>{
    clearInterval(clickTimer);
});
rightarrow.addEventListener('mousedown',()=>{
    clickTimer=setInterval(()=>{ 
        x-=20;
        shows.style.transform=`translateX(${x}px)`;},50);
});
rightarrow.addEventListener('mouseup',()=>{
    clearInterval(clickTimer);
});

leftarrow2.addEventListener('mousedown',()=>{
    clickTimer=setInterval(()=>{ 
        if(x>20)
        return;
        x+=20;
        shows2.style.transform=`translateX(${x}px)`;},50);
});
leftarrow2.addEventListener('mouseup',()=>{
    clearInterval(clickTimer);
});
rightarrow2.addEventListener('mousedown',()=>{
    clickTimer=setInterval(()=>{ x-=20;
        shows2.style.transform=`translateX(${x}px)`;},50);
});
rightarrow2.addEventListener('mouseup',()=>{
    clearInterval(clickTimer);
});

popular.addEventListener('mouseover',()=>{
    leftslider.style.transition='transform 0.2s ease-in-out';
    leftslider.style.transform='scaleX(100%)';
    rightslider.style.transition='transform 0.2s ease-in-out';
    rightslider.style.transform='scaleX(100%)';
});
popular.addEventListener('mouseout',()=>{
    leftslider.style.transition='transform 0.2s ease-in-out';
    leftslider.style.transform='scaleX(0)';
    rightslider.style.transition='transform 0.2s ease-in-out';
    rightslider.style.transform='scaleX(0)';
    clearInterval(clickTimer);
});
popular2.addEventListener('mouseover',()=>{
    leftslider2.style.transition='transform 0.2s ease-in-out';
    leftslider2.style.transform='scaleX(100%)';
    rightslider2.style.transition='transform 0.2s ease-in-out';
    rightslider2.style.transform='scaleX(100%)';
});
popular2.addEventListener('mouseout',()=>{
    leftslider2.style.transition='transform 0.2s ease-in-out';
    leftslider2.style.transform='scaleX(0)';
    rightslider2.style.transition='transform 0.2s ease-in-out';
    rightslider2.style.transform='scaleX(0)';
    clearInterval(clickTimer);
});