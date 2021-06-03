import env from 'dotenv';
import mongoose from 'mongoose';
env.config();

mongoose.connect("mongodb+srv://At11:atmak11@cluster0.d1re6.mongodb.net/dailySpending?retryWrites=true&w=majority", {
    useFindAndModify: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(_ => console.log('Database connect successfully!'))
    .catch(err => console.log(`Database connect error: ${err}`))
