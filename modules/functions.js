function type(val){
    return Object.prototype.toString.call(val).slice(8,-1).toLowerCase();
}
function rndm(max,min){
    let n = Math.floor(Math.random() * (max - min)) + min;
    return n;
}
function gibberish(minlength, maxlength){
    let chars = "abcdeABCDEF0123456789";
    let g = chars.split("").sort(() => {return Math.random() - 0.5}).join("").slice(0,rndm(maxlength,minlength));
    return g;
}
module.exports = {
    type,rndm,gibberish
}