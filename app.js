const express=require("express")
const app=express()
const mongoose=require('mongoose')
const PORT=process.env.PORT ||3000;
app.set("view engine","ejs")

app.use(express.json())
app.use(express.urlencoded({extended:false}));

mongoose.connect(process.env.MIMONGO)
.then (()=>{
    console.log("Conectado exitosamente");
})
.catch(()=>{
    console.log("Fallo en la conexion a la ND")
});

app.listen(3000, ()=> {
    console.log(" Server corriendo en http://localhost:"+PORT);

});


const clientSchema=mongoose.Schema({
    nombre:String,
    apellido:String,
    numero_c:Number,
    fecha:Date
})

const Cliente = mongoose.model("Cliente",clientSchema);

        // app.get("/",(req,res)=>{
        //     res.render("index")
        // })

app.post("/", async (req,res)=>{
    try {
     const cliente = await Cliente.create(req.body);
     res.redirect('/')
    } catch (error) {
     res.status(500).json({message:error.message})
    }
 });

app.get('/',async(req,res)=>{
    try {
        const clientes= await Cliente.find({});
        res.render('index',{clientes});
        
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});

app.get('/encontrar/:id',async(req,res)=>{
    try {
        const {id}=req.params;
        const cliente= await Cliente.findById(id);
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});

app.get('/editar/:id',async (req,res)=>{
    try {
        const {id} = req.params;
        const cliente = await Cliente.findById(id);

        if (!cliente){
            return res.status(404).json({message:"Cliente no encontrado"});
        } else {
            res.render('editar',{cliente});
        
        }
    } catch (error) {
        res.status(500).json({message:error.message});
    }

})

app.post('/editar/:id',async (req,res)=>{

    try {
        const {id} = req.params;
        const cliente = await Cliente.findById(id);

        if (!cliente){
            return res.status(404).json({message:"Cliente no encontrado"});
        } else {
            const updatedCliente= await Cliente.findByIdAndUpdate(id,req.body);
            res.redirect('/');
        
        }
    } catch (error) {
        res.status(500).json({message:error.message});
    }

});

app.get('/borrar/:id',async(req,res)=>{
    try {
        const {id}=req.params;
        const cliente= await Cliente.findByIdAndDelete(id);
        if (!cliente){
            return res.status(404).json({message:"Cliente no encontrado"});
        }
        res.redirect('/')
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});


