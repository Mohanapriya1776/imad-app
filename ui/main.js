console.log('Loaded!');

//Counter Code

var button=document.getElementById('counter');

button.onclick=function(){
    
    var request=new HMLHttpRequest();
    
    request.onreadystatechange=function(){
        if(request.readyState===HMLHttpRequest.DONE)
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