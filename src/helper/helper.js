
function validation(st){
if(st.length!=5)
return false;

var mm=parseInt(st.slice(0,2));
var ss=parseInt(st.slice(3,5));

if((mm>=0 && mm<=23) && (ss>=0 && ss<=23) )
return true; 

else
return false;
}
// validation(st);

export {validation};