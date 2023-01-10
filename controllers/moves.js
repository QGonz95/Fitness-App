const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

const Move = require('../models/moves.js');
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
        res.render('moves/new.ejs',{
            goals: allGoals,
            currentUser: req.session.currentUser
        });
    });
});

router.post('/', isAuthenticated, (req, res)=>{
    Goal.findById(req.body.goalId, (err, foundGoal)=>{
        Move.create(req.body, (err, createdMove)=>{ //req.body.authorId is ignored due to Schema
            foundGoal.moves.push(createdMove);
            foundGoal.save((err, data)=>{
                res.redirect('/moves');
            });
        });
    });
});

router.get('/', (req, res)=>{
    Move.find({}, (err, foundMoves)=>{
        res.render('moves/index.ejs', {
            moves: foundMoves,
            currentUser: req.session.currentUser
        })
    })
})

//avoid this handling /new by placing it towards the bottom of the file
router.get('/:id', (req, res)=>{
    Move.findById(req.params.id, (err, foundMove)=>{
        Goal.findOne({'moves.id':req.params.id}, (err, foundGoal)=>{
            res.render('moves/show.ejs', {
                goal: foundGoal,
                move: foundMove,
                currentUser: req.session.currentUser
            });
        });
    });
});

router.delete('/:id', isAuthenticated, (req, res)=>{
    Move.findByIdAndRemove(req.params.id, (err, foundMove)=>{
        Goal.findOne({'moves._id':req.params.id}, (err, foundGoal)=>{
            foundGoal.moves.id(req.params.id).remove();
            foundGoal.save((err, data)=>{
                res.redirect('/moves');
            });
        });
    });
});


router.get('/:id/edit', (req, res)=>{
    Move.findById(req.params.id, (err, foundMoves)=>{
		Goal.find({}, (err, allGoals)=>{
			Goal.findOne({'moves._id':req.params.id}, (err, foundMoveGoal)=>{
				res.render('moves/edit.ejs', {
					moves: foundMoves,
					goals: allGoals,
					moveGoal: foundMoveGoal,
                    currentUser: req.session.currentUser
				});
            });
		});
	});
});


router.put('/:id', isAuthenticated, (req, res)=>{
    Move.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedMove)=>{
        Goal.findOne({ 'moves._id' : req.params.id }, (err, foundGoal)=>{
		if(foundGoal._id.toString() !== req.body.moveId){
			foundGoal.moves.id(req.params.id).remove();
			foundGoal.save((err, savedFoundGoal)=>{
				Goal.findById(req.body.goalId, (err, newGoal)=>{
					newGoal.moves.push(updatedMove);
					newGoal.save((err, savedNewGoal)=>{
			        	        res.redirect('/moves/'+req.params.id);
					});
				});
			});
		} else {
			foundGoal.moves.id(req.params.id).remove();
			foundGoal.moves.push(updatedMove);
			foundGoal.save((err, data)=>{
		                res.redirect('/moves/'+req.params.id);
			});
		}
        });
    });
});

module.exports = router;
