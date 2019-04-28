const express =require('express');
const router = express.Router();
const Idea =require('../models/Idea');
const {ensureAuth} =require('../helpers/auth');


router.get('/',ensureAuth,(req,res)=>{
    Idea.find({user:req.user.id})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render('ideas/index',{
            ideas:ideas
        })
    })
    
})
router.get('/edit/:id',ensureAuth,(req,res)=>{
    Idea.findById({_id:req.params.id})
    .catch(err=>{
        req.flash('err_msg',err)
    })
    .then(idea=>{
        if(idea.user != req.user.id)
        {
            req.flash('err_msg','not Auth');
            res.redirect('/ideas');
        }
       else{
        res.render('ideas/edit',{
            idea:idea
        });
       }
    });
});
router.get('/add',ensureAuth,(req,res)=>{
    res.render('ideas/add')
})

router.post('/',ensureAuth,(req,res)=>{
    let errors =[];
    //some server side validation
    if(!req.body.title) errors.push({text:'please add a title'});
    if(!req.body.dets)errors.push({text:'please add a details '});
    if(errors.length > 0){
        res.render('ideas/add',{
            errors:errors,
            title:req.body.title,
            dets:req.body.dets
        })
    }else{
        const newUser= {
            title:req.body.title,
            dets:req.body.dets,
            user:req.user.id
        }
        new Idea(newUser)
        .save()
        .then(idea =>{
            req.flash('su_msg','Your Idea has been Added');
            res.redirect('/ideas')
        });
    }
});

router.put('/:id',ensureAuth,(req,res)=>{
    Idea.findOneAndUpdate({_id:req.params.id},{title:req.body.title,dets:req.body.dets})
    .then(updated=>{
        req.flash('su_msg','Your Idea has been Updated');
        res.redirect('/ideas')
    }).catch(err=>{
        req.flash('err_msg',err)
    });
});
router.delete('/:id',ensureAuth,(req,res)=>{
    Idea.findOneAndDelete({_id:req.params.id})
    .then(()=>{
        req.flash('su_msg','Your Idea has been removed');
        res.redirect('/ideas');
    })
    .catch(err=>{
        req.flash('err_msg',err)
    });
});
module.exports = router;


