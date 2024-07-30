module.exports = (say)=>{
    say.on ('hello', req => `Hello ${req.data.to}!`)
}