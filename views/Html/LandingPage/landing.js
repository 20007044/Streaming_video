var getStarted=document.getElementById('getstarted');
var emailForm=document.getElementById('emailform');
var email=document.getElementById('email');
var errormsg=document.getElementById('errormessage');

if(errormsg.innerText!='')
{
    email.style.border='1px solid darkorange';
}
else
{
    email.style.border='1px solid white';
}
getStarted.addEventListener('click',()=>{emailForm.submit();});
