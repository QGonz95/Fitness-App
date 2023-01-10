const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

const Entry = require('../models/journals.js');
const Goal = require('../models/goals.js');

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
      return next()
    } else {
      res.redirect('/sessions/new')
    }
  }

router.use(express.urlencoded({extended:false}));
router.use(methodOverride('_method'));
router.use(express.json())

router.get('/new', (req, res)=>{
    Goal.find({}, (err, allGoals)=>{
        res.render('entry/new.ejs',{
            goals: allGoals,
            currentUser: req.session.currentUser
        });
    });
});

router.post('/', isAuthenticated, (req, res)=>{
    Goal.findById(req.body.goalId, (err, foundGoal)=>{
        Entry.create(req.body, (err, createdEntry)=>{ //req.body.authorId is ignored due to Schema
            foundGoal.entry.push(createdEntry);
            foundGoal.save((err, data)=>{
                res.redirect('/entry');
            });
        });
    });
});

router.get('/', (req, res)=>{
    Entry.find({}, (err, foundEntry)=>{
        res.render('entry/index.ejs', {
            entry: foundEntry,
            currentUser: req.session.currentUser
        })
    })
})

//avoid this handling /new by placing it towards the bottom of the file
router.get('/:id', (req, res)=>{
    Entry.findById(req.params.id, (err, foundEntry)=>{
        Goal.findOne({'entry.id':req.params.id}, (err, foundGoal)=>{
            res.render('entry/show.ejs', {
                goal: foundGoal,
                entry: foundEntry,
                currentUser: req.session.currentUser
            });
        });
    });
});

router.delete('/:id', isAuthenticated, (req, res)=>{
    Entry.findByIdAndRemove(req.params.id, (err, foundEntry)=>{
        Goal.findOne({'entry._id':req.params.id}, (err, foundGoal)=>{
            foundGoal.entry.id(req.params.id).remove();
            foundGoal.save((err, data)=>{
                res.redirect('/entry');
            });
        });
    });
});


router.get('/:id/edit', (req, res)=>{
    Entry.findById(req.params.id, (err, foundEntry)=>{
		Goal.find({}, (err, allGoals)=>{
			Goal.findOne({'entry._id':req.params.id}, (err, foundEntryGoal)=>{
				res.render('entry/edit.ejs', {
					entry: foundEntry,
					goals: allGoals,
					entryGoal: foundEntryGoal,
                    currentUser: req.session.currentUser
				});
            });
		});
	});
});


router.put('/:id', isAuthenticated, (req, res)=>{
    Entry.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedEntry)=>{
        Goal.findOne({ 'entry._id' : req.params.id }, (err, foundGoal)=>{
		if(foundGoal._id.toString() !== req.body.entryId){
			foundGoal.entry.id(req.params.id).remove();
			foundGoal.save((err, savedFoundGoal)=>{
				Goal.findById(req.body.goalId, (err, newGoal)=>{
					newGoal.entry.push(updatedEntry);
					newGoal.save((err, savedNewGoal)=>{
			        	        res.redirect('/entry/'+req.params.id);
					});
				});
			});
		} else {
			foundGoal.entry.id(req.params.id).remove();
			foundGoal.entry.push(updatedEntry);
			foundGoal.save((err, data)=>{
		                res.redirect('/entry/'+req.params.id);
			});
		}
        });
    });
});

module.exports = router;
