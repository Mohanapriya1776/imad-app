console.log('Loaded!');

//Counter Code

var button=document.getElementById('counter');

button.onclick=function(){
    
    var request=new XMLHttpRequest();
    
    request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE)
        {
            //Take some action
            
            if(request.status===200){
                var counter=request.responseText;
                var span=document.getElementById('count');
                span.innerHTML=counter.toString();
                
            }
            
        }
        //Not done yet
    };
    //Make the request
    
    request.open('GET','http://mohanapriyasubramaniam.imad.hasura-app.io/counter',true);
    request.send(null);
    
};

//Submit Name

var submit=document.getElementById("submit_button");

submit.onclick=function()
{
     var nameInput=document.getElementById("name");
     var name=nameInput.value;
      var request=new XMLHttpRequest();
     request.open('GET','http://mohanapriyasubramaniam.imad.hasura-app.io/submit_name?name='+name,true);
    request.send(null);
   
   
   /* var names=['name1','name2'];*/
     request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE)
        {
            //Take some action
            
            if(request.status===200){
                    var names=request.responseText;
   names=JSON.parse(names);
    
    var list='';
    
    for(var i=0;i<names.length;i++)
    {
        list+='<li>'+names[i]+'<li>';
    }
    
    var namelist=document.getElementById("namelist");
    
    namelist.innerHTML=list;
    
    
}
}
};
};



//usrname,password




document.ready(function(){
    
    var request=new XMLHttpRequest();
      request.open('POST','http://mohanapriyasubramaniam.imad.hasura-app.io/create-user',true);
      request.send(JSON.stringify({username:"John Rambo", password:"pwd"}));

    request.setRequestHeader('Content-Type', 'application/json');
    
    request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE)
        {
            //Take some action
            
            if(request.status===200){
                var counter=request.responseText;
               
                
            }
            
        }
        //Not done yet
    };
    //Make the request
    
  
    
});
