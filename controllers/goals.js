const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const isAuthenticated = (req, res, next) => {
	if (req.session.currentUser) {
	  return next()
	} else {
	  res.redirect('/sessions/new')
	}
  }
const Goal = require('../models/goals.js');
const Move = require('../models/moves.js');
const Entry = require('../models/journals.js')

router.use(express.json());
router.use(express.urlencoded({extended:false}));
router.use(methodOverride('_method'));



// NEW ROUTE
router.get('/new', (req, res)=>{
	res.render('goals/new.ejs', { 
		currentUser: req.session.currentUser
		 
	});
});

router.post('/', isAuthenticated, (req, res)=>{
    Goal.create(req.body, (err, createdGoal)=>{
        res.redirect('/goals');
    });
});
// index
router.get('/', (req, res)=>{
	Goal.find({}, (err, foundGoals)=>{
		res.render('goals/index.ejs', {
			goals: foundGoals,
			currentUser: req.session.currentUser
		});
	});
});
router.get('/:id', (req, res)=>{
	Goal.findById(req.params.id, (err, foundGoal)=>{
		res.render('goals/show.ejs', {
			goal: foundGoal,
			currentUser: req.session.currentUser
		});
	});
})

router.delete('/:id', isAuthenticated, (req, res)=>{
	Goal.findByIdAndRemove(req.params.id, (err, foundGoal)=>{
		const moveIds = [];
		for (let i = 0; i < foundGoal.moves.length; i++) {
			moveIds.push(foundGoal.moves[i]._id);
		}
		Move.remove(
			{
				_id : {
					$in: moveIds
				}
			},
			(err, data)=>{
				res.redirect('/goals');
			}
		);
		const entryIds = [];
		for (let i = 0; i < foundGoal.entry.length; i++) {
			entryIds.push(foundGoal.entry[i]._id);
		}
		Entry.remove(
			{
				_id : {
					$in: entryIds
				}
			},
			(err, data)=>{
				res.redirect('/goals');
			}
		);
	});
});

router.get('/:id/edit', (req, res)=>{
	Goal.findById(req.params.id, (err, foundGoal)=>{
		res.render('goals/edit.ejs', {
			goal: foundGoal,
			currentUser: req.session.currentUser
		});
	});
});

router.put('/:id', isAuthenticated, (req, res)=>{
	Goal.findByIdAndUpdate(req.params.id, req.body, {new: true}, ()=>{
		res.redirect('/goals');
	});
});


module.exports = router;