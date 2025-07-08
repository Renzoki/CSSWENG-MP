const connectDB = require('./config/connect')
const Article = require('./models/article')



const run = async () => {
    try{
        await connectDB();

        const testArticle = new Article({
            title: "Entablado Article",
            author: "LittleFlowerPh",
            status: "unfinished",
            publish_date: new Date("2000/01/01"),
            blocks: [
            {
                type: "image",
                content: "test content"
            },
            {
                type: "text",
                content: "entablado"
            }]
        })

        await testArticle.save()
        console.log("Test article saved")
    }catch(err) {
        console.error("Error saving article: ",err)
    }
};

run();