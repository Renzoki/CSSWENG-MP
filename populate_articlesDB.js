const connectDB = require('./config/connect');
const Article = require('./models/article');

const run = async () => {
    try {
        await connectDB();

        const testArticle = new Article({
            title: "Wicked: The Untold Story of the Witches of Oz",
            author: "LittleFlowerPH",
            status: "unfinished",
            publish_date: null,
            blocks: [
                {
                    type: "text",
                    data: `<p><strong>Wicked</strong> is a Broadway musical that tells the story of what happened before Dorothy arrived in Oz. It's a tale of friendship, rivalry, and how perception shapes reality.</p>`,
                    order: 0
                },
                {
                    type: "image",
                    data: "/uploads/wicked-banner.jpg", // replace with actual image path if needed
                    order: 1
                },
                {
                    type: "text",
                    data: `<p>The story centers around Elphaba, the misunderstood green-skinned girl, and Glinda, the popular and ambitious blonde witch. Through a series of events, their lives intertwine in unexpected ways.</p>`,
                    order: 2
                },
                {
                    type: "text",
                    data: `<p>With unforgettable songs like <em>"Defying Gravity"</em> and <em>"For Good"</em>, Wicked has enchanted audiences for over two decades.</p>`,
                    order: 3
                }
            ]
        });

        await testArticle.save();
        console.log("✅ Wicked test article saved successfully.");
    } catch (err) {
        console.error("❌ Error saving article:", err);
    }
};

run();
