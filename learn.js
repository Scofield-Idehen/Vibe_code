async function myfunc(){
    const truefalse=3.6
    console.log(typeof truefalse)
}
myfunc()
    .then(() => ProcessingInstruction.exit(0))
    .catch((error) => {
        console.error(error);
        Process.exit(1);
    });