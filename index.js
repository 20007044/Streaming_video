const express=require('express');
const fileSystem=require('fs');
const app=express();
const dot=require('dotenv');
const ffg=require('fluent-ffmpeg');
const mongo=require('mongoose');
const youtube=require('ytdl-core');


dot.config({path:'./config.env'});
var mongodb=mongo.connect(process.env.MONGO_URI,{dbName:'videogo'}).catch(e=>console.log(e)).then(e=>console.log('Database connected!'));

var schema=mongo.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:
    {
        type:String,
        required:true,
    }
});
var model=mongo.model('videogomodel',schema);

const axios = require('axios');


app.use(express.static(__dirname+"/views/Html"));
app.use(express.static(__dirname+"/views/Html/MainPage"));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));

const request=require('request');


const youtubePlaylist={};
const getYoutubeVideoData = async (youtubeVideoId) => {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
          params: {
            playlistId: youtubeVideoId,
            key: "AIzaSyBg44q41KUcNpXbdRxw38c6ToRk-uotwL0",
            maxResults: 70,
            part: 'snippet'
          }
        });
        for(var i in response.data.items)
        {
            if(response.data.items[i].snippet.thumbnails.high!=null)
             {
                youtubePlaylist[i]={
                thumb:response.data.items[i].snippet.thumbnails.high.url,
                video_url:`https://www.youtube.com/watch?v=${response.data.items[i].snippet.resourceId.videoId}`
            }
                
            }
        }
    }

var data=getYoutubeVideoData('PLR8SOzJTINLzwSa1jXOq4yjKIO3M4E8CM');
 
const trackdata = {
    method: 'GET',
    url: 'https://theaudiodb.p.rapidapi.com/track-mb.php',
    params: {
      i: 'c3fe7791-0a91-4f0a-a89b-b056f38d3cde'
    },
    headers: {
      'X-RapidAPI-Key': '2a8fb3063cmsh8221a5cb6e5675cp16df02jsn3b6df1438a33',
      'X-RapidAPI-Host': 'theaudiodb.p.rapidapi.com'
    }
  };
  
//For album details
const options = {
    method: 'GET',
  url: 'https://theaudiodb.p.rapidapi.com/mvid-mb.php',
  params: {
    i: '20244d07-534f-4eff-b4d4-930878889970'
  },
  headers: {
    'X-RapidAPI-Key': '2a8fb3063cmsh8221a5cb6e5675cp16df02jsn3b6df1438a33',
    'X-RapidAPI-Host': 'theaudiodb.p.rapidapi.com'
  }
};

trackDetails={};
async function  streaming()
{
    try {
        const response = await axios.request(options);
        var mvids=response.data.mvids;
        filteration(mvids,trackDetails);

       
    } catch (error) {
        console.error(error);
    }
}
function filteration(source,target)
{
    for(var i in source)
    {
        target[i]={
        trackName:source[i].strTrack,
        videoUrl:source[i].strMusicVid,
        trackThumb:source[i].strTrackThumb,
        };
    }
    
    for(var i in target)
    {
        if(target[i].trackThumb==null)
        {
            delete target[i];
        }
    }
    // console.log(source);
}
streaming();

app.get('/',(req,res)=>{
    res.render(__dirname+'/views/Html/LandingPage/landing.ejs',{error:''});
});
const regex=/^[\w-]+(\.[\w-]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/;
app.post('/email',async (req,res)=>{
   const {email}=req.body;
 

   if(email=='' || !regex.test(email))
   {
    let errormsg='Email id not valid!';
    res.render(__dirname+'/views/Html/LandingPage/landing.ejs',{error:errormsg});
    return;
   }
   var user=await model.findOne({email:email});
  
   if(!user || user=='')
   {
    res.render(__dirname+'/views/Html/RegisterPage/register.ejs',{error:''});
   }
   else
   {
    res.render(__dirname+'/views/Html/LoginPage/login.ejs',{email:user.email,error:''});
   }
});

app.post('/registeration',async (req,res)=>{
    const {name,email,password,confirmpassword}=req.body; 
    
    if(name=='' || !name || email=='' || !email || password=='' || !password || confirmpassword=='' || !confirmpassword)
    {
        res.render(__dirname+'/views/Html/RegisterPage/register.ejs',{error:'Something is missing!'});
        return;
    }
    if(password!=confirmpassword)
    {
        res.render(__dirname+'/views/Html/RegisterPage/register.ejs',{error:'password not match!'});
        return;
    }
    await model.create({name:name,email:email,password:password});
    res.render(__dirname+'/views/Html/MainPage/index.ejs',{images:trackDetails,youtubeplaylist:youtubePlaylist});
    
});
app.get('/sign',(req,res)=>{
    res.render(__dirname+'/views/Html/LoginPage/login.ejs',{email:'',error:''});
});

app.post('/login',async (req,res)=>{
    const {email,password}=req.body;
    var user=await model.findOne({email:email});
    if(!user || user=='')
    {
        res.render(__dirname+'/views/Html/LoginPage/login.ejs',{email:'',error:'User not found!'});
        return;
    }
    else
    {
        if(user.password!=password)
        {
            res.render(__dirname+'/views/Html/LoginPage/login.ejs',{email:'',error:'Password Incorrect!'});
            return;
        }
        res.cookie('id','asdasdasdcxz',{httpOnly:true,secure:true});
        res.render(__dirname+'/views/Html/MainPage/index.ejs',{images:trackDetails,youtubeplaylist:youtubePlaylist});
    }
});
app.get('/register',(req,res)=>{
    res.render(__dirname+'/views/Html/RegisterPage/register.ejs',{error:''});
});


app.get('/frame',(req,res)=>{
    res.sendFile(__dirname+'/Html/index.html');
});

app.get('/video',(req,res)=>{
    const range=req.headers.range; 
    if(!range)
    {
        res.send("Range header");
        return; 
    }
    var videoPath=__dirname+`/Videos/dummy.mp4`;
    var videoSize=fileSystem.statSync(videoPath).size;
  
    const chunk_Size=(50000); //1 MB
    const start=Number(range.replace(/\D/g,""));
   
    const end=Math.min(start+chunk_Size,videoSize);

    const headers={
      "Content-Range":`bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges":`bytes`,
      "Content-Type": 'video/mp4',
    };
    res.writeHead(206,headers);
    console.log(videoSize,range);
    const videoStream=fileSystem.createReadStream(videoPath,{start,end});
    console.log('start:'+(start/1024)/1024+' end:'+(end/1024)/1024+" videoSize:"+(videoSize/1024)/1024);

    videoStream.pipe(res);
})

app.get('/videoconverted',(req,res)=>{
    console.log('VIDEO');
    console.log('video converted');
    const range=req.headers.range; 
    if(!range)
    {
        res.send("Range header");
        return; 
    }
    var videopath=__dirname+'/Videos/output.mp4';
    var videoSize=fileSystem.statSync(videoPath).size;
  
    const chunk_Size=(50000); //1 MB
    const start=Number(range.replace(/\D/g,""));
   
    const end=Math.min(start+chunk_Size,videoSize);

    const headers={
      "Content-Range":`bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges":`bytes`,
      "Content-Type": 'video/mp4',
    };
    res.writeHead(206,headers);
    console.log(videoSize,range);
    const videoStream=fileSystem.createReadStream(videoPath,{start,end});
    console.log('start:'+(start/1024)/1024+' end:'+(end/1024)/1024+" videoSize:"+(videoSize/1024)/1024);

    videoStream.pipe(res);
})

ffg.setFfmpegPath('./ffmpeg-6.0-essentials_build/bin/ffmpeg.exe');
ffg.setFfprobePath('./ffmpeg-6.0-essentials_build/bin/ffprobe.exe');

app.get('/player',async(req,res)=>{
    const query=req.query;
   
    console.log(query.url);
    const video=await youtube.getInfo('https://www.youtube.com/watch?v=r7qovpFAGrQ');
    console.log('query',video);
    // const format = youtube.chooseFormat(video.formats, { quality: 'highestvideo' });

    // console.log('working player');
    // youtube(query.url).pipe(fileSystem.createWriteStream(__dirname+`/videos/input.mp4`)).on('finish',()=>{
    //     console.log("video downloaded finished!");
    //     ffg(__dirname+`/videos/input.mp4`).output(__dirname+`/videos/output.mp4`).on('end',()=>{console.log('video converted successfully');     
    //     videoPath=__dirname+`/videos/output.mp4`;
    //     res.render(__dirname+'/views/Html/streaming player/streamingvideo.ejs',{url:req.query.url,src:'/videoconverted'});
    //     console.log('video started');
    // }).on('error',(err)=>console.log('err found',err)).run();
    // });
});

app.get('/logout',(req,res)=>{
    res.cookie('id','',{expires:new Date(Date.now())});
    res.render(__dirname+'/views/Html/LoginPage/login.ejs',{email:'',error:''});
});
const videodetails={};

app.get('/wow',async (req,res)=>{
    const videoinfo=await youtube.getBasicInfo(req.query.url);
    videodetails.title=videoinfo.videoDetails.title;
    videodetails.description={'category':videoinfo.videoDetails.category,
    'PublishedDate':videoinfo.videoDetails.publishDate,
    'ViewsCount':videoinfo.videoDetails.viewCount,
    'UploadDate':videoinfo.videoDetails.uploadDate,
    'OwnershipChannelName':videoinfo.videoDetails.ownerChannelName,
    };
    res.render(__dirname+'/views/Html/streaming player/streamingvideo.ejs',{url:req.query.url,src:'/video',videotitle:videodetails.title,category:videodetails.description.category,
    publisheddate:videodetails.description.PublishedDate,
    viewscount:videodetails.description.ViewsCount,
    uploaddate:videodetails.description.UploadDate,
    ownershipdate:videodetails.description.OwnershipChannelName,
    });
});
app.listen(process.env.PORT,'0.0.0.0',()=>console.log('Connected!'));