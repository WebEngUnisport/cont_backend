const Joi = require('joi');
const Mongoose = require('mongoose');

var Course = Mongoose.model('Course');
var Category = Mongoose.model('Category');
var University = Mongoose.model('University');

var registerPaths = (server) => {
    server.route({
        method: 'GET',
        path: '/courses',
        handler: function (request, reply) {
            let from = request.query.from;
            let to = request.query.to;

            if(from && to){
                if(from >= to ){
                    return reply({"error": "From has to be smaller then to"}).code(400)
                }
                Course.find({}, function (err, courses) {
                    if (err) {
                        console.error(err);
                        return reply({"error": "Database problem. Please try again later."}).code(500);
                    }

                    if (courses.length === 0) {
                        return reply({"error": "There are no courses in the database"}).code(404);
                    }

                    let result = [];

                    courses.forEach(function (course) {
                        let set = false;
                        course.dates.forEach(function (date) {
                            if (!set) {
                                if (date.to <= to && date.from >= from) {
                                    result.push(course);
                                    set = true;
                                }
                            }
                        })
                    });

                    reply(result).code(200);
                })
            } else {

                Course.find({}, function (err, courses) {
                    if (err) {
                        console.error(err);
                        return reply({"error": "Database problem. Please try again later."}).code(500);
                    }

                    if (courses.length === 0) {
                        return reply({"error": "There are no courses in the database"}).code(404);
                    }

                    reply(courses).code(200);
                });
            }
        },
        config: {
            tags: ['api'],
            description: 'Get all courses',
            validate: {
              query: {
                  from: Joi.date(),
                  to: Joi.date()
              }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/course/{course_id}',
        handler: function (request, reply) {
            Course.findById(request.params.course_id, function (err, course) {
                if(err) {
                    console.error(err);
                    return reply({"error": "Database problem. Please try again later."}).code(500);
                }

                if(!course){
                    return reply({"error": "There is no course with the given ID in our database"}).code(404);
                }

                reply(course).code(200);
            })
        },
        config: {
            tags: ['api'],
            description: 'Get a course with a certain id',
            validate: {
                params: {
                    course_id: Joi.string()
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/categories',
        handler: function (request, reply) {
            Category.find({}, function (err, categories) {
                if(err) {
                    console.error(err);
                    return reply({"error": "Database problem. Please try again later."}).code(500);
                }

                if(categories.length === 0){
                    return reply({"error": "There are no categories in the database"}).code(404);
                }

                reply(categories).code(200);
            });
        },
        config: {
            tags: ['api'],
            description: 'Gets all the categories',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/categories/{category_id}',
        handler: function (request, reply) {
            let from = request.query.from;
            let to = request.query.to;

            if(from && to){
                if(from >= to ){
                    return reply({"error": "From has to be smaller then to"}).code(400)
                }
                Course.find({'category.code': request.params.category_id}, 'sport university.code category.name times time day dates', function (err, courses) {
                    if (err) {
                        console.error(err);
                        return reply({"error": "Database problem. Please try again later."}).code(500);
                    }

                    if (!courses) {
                        return reply({"error": "There is no category with the given ID in our database"}).code(404);
                    }

                    let parRes = [];

                    courses.forEach(function (course) {
                        let set = false;
                        course.dates.forEach(function (date) {
                            if (!set) {
                                if (date.to <= to && date.from >= from) {
                                    course.dates = undefined;
                                    parRes.push(course);
                                    set = true;
                                }
                            }
                        })
                    });

                    reply(parRes).code(200);
                });
            } else {
                Course.find({'category.code': request.params.category_id}, 'sport university.code category.name times time day', function (err, courses) {
                    if (err) {
                        console.error(err);
                        return reply({"error": "Database problem. Please try again later."}).code(500);
                    }

                    if (!courses) {
                        return reply({"error": "There is no category with the given ID in our database"}).code(404);
                    }

                    reply(courses).code(200);
                });
            }
        },
        config: {
            tags: ['api'],
            description: 'Returns all the courses from a certain category',
            validate: {
                query: {
                    from: Joi.date(),
                    to: Joi.date()
                },
                params: {
                    category_id: Joi.string()
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/universities',
        handler: function (request, reply) {
            University.find({}, function (err, universities) {
                if(err) {
                    console.error(err);
                    return reply({"error": "Database problem. Please try again later."}).code(500);
                }

                if(universities.length === 0){
                    return reply({"error": "There are no universities in the database"}).code(404);
                }

                reply(universities).code(200);
            });
        },
        config: {
            tags: ['api'],
            description: 'Gets all universities',
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/universities/courses',
        handler: function (request, reply) {
            let from = request.query.from;
            let to = request.query.to;

            if(from && to){
                if(from >= to ){
                    return reply({"error": "From has to be smaller then to"}).code(400)
                }
                Course.find({}, function (err, courses) {
                    if (err) {
                        console.error(err);
                        return reply({"error": "Database problem. Please try again later."}).code(500);
                    }

                    if (courses.length === 0) {
                        return reply({"error": "There are no courses in the database"}).code(404);
                    }

                    University.find({}, function (err, universities) {
                        let result = [];

                        if (err) {
                            console.error(err);
                            return reply({"error": "Database problem. Please try again later."}).code(500);
                        }

                        if (universities.length === 0) {
                            return reply({"error": "There are no universities in the database"}).code(404);
                        }

                        universities.forEach(function (uni) {
                            let c = [];
                            courses.forEach(function (course) {
                                if (course.university.code === uni.code) {
                                    course.dates.forEach(function (date) {
                                        if (date.to <= to && date.from >= from) {
                                            c.push(course);
                                        }
                                    })
                                }
                            });

                            result.push({name: uni.name, code: uni.code, courses: c});
                        });

                        reply(result).code(200);
                    });
                });
            } else {
                Course.find({}, function (err, courses) {
                    if (err) {
                        console.error(err);
                        return reply({"error": "Database problem. Please try again later."}).code(500);
                    }

                    if (courses.length === 0) {
                        return reply({"error": "There are no courses in the database"}).code(404);
                    }

                    University.find({}, function (err, universities) {
                        let result = [];

                        if (err) {
                            console.error(err);
                            return reply({"error": "Database problem. Please try again later."}).code(500);
                        }

                        if (universities.length === 0) {
                            return reply({"error": "There are no universities in the database"}).code(404);
                        }

                        universities.forEach(function (uni) {
                            let c = [];
                            courses.forEach(function (course) {
                                if (course.university.code === uni.code) {
                                    c.push(course);
                                }
                            });

                            result.push({name: uni.name, code: uni.code, courses: c});
                        });

                        reply(result).code(200);
                    });
                });
            }
        },
        config: {
            tags: ['api'],
            description: 'Gets all courses of all universities',
            validate:{
                query: {
                    from: Joi.date(),
                    to: Joi.date()
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/university/{university_id}/courses',
        handler: function (request, reply) {
            let from = request.query.from;
            let to = request.query.to;

            if(from && to){
                if(from >= to ){
                    return reply({"error": "From has to be smaller then to"}).code(400)
                }
                Course.find({'university.code': request.params.university_id}, 'sport university.code category.name times time day dates', function (err, courses) {
                    if (err) {
                        console.error(err);
                        return reply({"error": "Database problem. Please try again later."}).code(500);
                    }

                    if (!courses) {
                        return reply({"error": "There is no courses for the given universities"}).code(404);
                    }

                    let parRes = [];

                    courses.forEach(function (course) {
                        let set = false;
                        course.dates.forEach(function (date) {
                            if (!set) {
                                if (date.to <= to && date.from >= from) {
                                    course.dates = undefined;
                                    parRes.push(course);
                                    set = true;
                                }
                            }
                        })
                    });

                    reply(parRes).code(200);
                })
            } else {
                Course.find({'university.code': request.params.university_id}, 'sport university.code category.name times time day', function (err, courses) {
                    if (err) {
                        console.error(err);
                        return reply({"error": "Database problem. Please try again later."}).code(500);
                    }

                    if (!courses) {
                        return reply({"error": "There is no courses for the given universities"}).code(404);
                    }

                    reply(courses).code(200);
                })
            }
        },
        config: {
            tags: ['api'],
            description: 'Gets all courses of a specified university',
            validate: {
                query: {
                    from: Joi.date(),
                    to: Joi.date()
                },
                params: {
                    university_id: Joi.string()
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/university/{university_id}/category/{category_id}',
        handler: function (request, reply) {
            let from = request.query.from;
            let to = request.query.to;
            let uId = request.params.university_id;
            let cId = request.params.category_id;

            if(from && to){
                if(from >= to ){
                    return reply({"error": "From has to be smaller then to"}).code(400)
                }
                Course.find({'university.code': uId, 'category.code': cId}, function (err, courses) {
                    if (err) {
                        console.error(err);
                        return reply({"error": "Database problem. Please try again later."}).code(500);
                    }

                    if (!courses) {
                        return reply({"error": "There is no courses for the given university and the given category"}).code(404);
                    }

                    let parRes = [];

                    courses.forEach(function (course) {
                        let set = false;
                        course.dates.forEach(function (date) {
                            if (!set) {
                                if (date.to <= to && date.from >= from) {
                                    parRes.push(course);
                                    set = true;
                                }
                            }
                        })
                    });

                    reply(parRes).code(200);
                })
            } else {
                Course.find({'university.code': uId, 'category.code': cId}, function (err, courses) {
                        if (err) {
                            console.error(err);
                            return reply({"error": "Database problem. Please try again later."}).code(500);
                        }

                        if (!courses) {
                            return reply({"error": "There is no courses for the given university and the given category"}).code(404);
                        }

                        reply(courses).code(200);
                    })
            }
        },
        config: {
            tags: ['api'],
            description: 'Gets all courses of a certain category from a given university',
            validate: {
                query: {
                    from: Joi.date(),
                    to: Joi.date()
                },
                params: {
                    university_id: Joi.string(),
                    category_id: Joi.string()
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/university/{university_id}/course/{course_id}',
        handler: function (request, reply) {
            let uId = request.params.university_id;
            let cId = request.params.course_id;

            Course.find({'university.code': uId, _id: cId},
                function (err, courses) {
                    if (err) {
                        console.error(err);
                        return reply({"error": "Database problem. Please try again later."}).code(500);
                    }

                    if (!courses) {
                        return reply({"error": "There is no courses for the given university with the given id"}).code(404);
                    }

                    reply(courses).code(200);
                })
        },
        config: {
            tags: ['api'],
            description: 'Gets a certain course form a given university',
            validate: {
                params: {
                    university_id: Joi.string(),
                    course_id: Joi.string()
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/random',
        handler: function (request, reply) {
            let from = request.query.from;
            let to = request.query.to;

            if(from && to){
                if(from >= to ){
                    return reply({"error": "From has to be smaller then to"}).code(400)
                }
                Course.find({}, function (err, courses) {
                    if (err) {
                        console.error(err);
                        return reply({"error": "Database problem. Please try again later."}).code(500);
                    }

                    if (!courses) {
                        return reply({"error": "There is no courses in the database"}).code(404);
                    }

                    let parRes = [];

                    courses.forEach(function (course) {
                        let set = false;
                        course.dates.forEach(function (date) {
                            if (!set) {
                                if (date.to <= to && date.from >= from) {
                                    parRes.push(course);
                                    set = true;
                                }
                            }
                        })
                    });
                    if(parRes.length === 0){
                        reply("empty").code(200);
                    }
                    else{
                        var random = Math.floor(Math.random()*parRes.length);
                        reply(parRes[random]).code(200);
                    }                    
                });
            }
            else{
                Course.count().exec(function(err,count){
                    var random = Math.floor(Math.random()*count);
                    Course.findOne({},'sport university.code category.name times time day').skip(random).exec(
                    function (err, courses) {
                        if (err) {
                            console.error(err);
                            return reply({"error": "Database problem. Please try again later."}).code(500);
                        }

                        if (!courses) {
                            return reply({"error": "There is no courses in the database"}).code(404);
                        }

                        reply(courses).code(200);
                    })
                }
                );
            }
        },
        config: {
            tags: ['api'],
            description: 'Get a random courses from the database',
            validate:{
                query: {
                    from: Joi.date(),
                    to: Joi.date()
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/day/{day_code}',
        handler: function (request, reply) {
            var dayTable = ["(Monday|Lundi|Montag)","(Thuesday|Mardi|Dienstag)","(Wednesday|Mercredi|Mittwoch)",
            "(Thursday|Jeudi|Donnerstag)","(Friday|Vendredi|Freitag)","(Saturnday|Samedi|Samstag)","(Sunday|Dimanche|Sonntag)"];
            var dayToSearch = dayTable[parseInt(request.params.day_code)];
            Course.find({$or:[{"times":{"$regex":dayToSearch,"$options":"i"}},{"day":{"$regex":dayToSearch,"$options":"i"}}]},'sport university.code category.name times time day',
            function (err, courses) {
                if (err) {
                    console.error(err);
                    return reply({"error": "Database problem. Please try again later."}).code(500);
                }

                if (!courses) {
                    return reply({"error": "There is no courses this day"}).code(404);
                }

                reply(courses).code(200);
            })

        },
        config: {
            tags: ['api'],
            description: 'Get courses from the day',
            validate: {
                params: {
                    day_code: Joi.string()
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success'
                        }
                    }
                }
            }
        }
    });
};

module.exports = registerPaths;