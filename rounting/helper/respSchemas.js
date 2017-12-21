const Joi = require('joi');

let university = {
    _id: Joi.string(),
    name: Joi.string(),
    code: Joi.string()
};

let category = {
    _id: Joi.string(),
    name: Joi.string(),
    code: Joi.string()
};

let course = {
    "_id": Joi.string(),
    "targetAudience": Joi.string(),
    "priceStudents": Joi.string(),
    "priceStaff": Joi.string(),
    "priceExternal": Joi.string(),
    "registration": Joi.string(),
    "cancellation": Joi.string(),
    "description": Joi.string(),
    "information": Joi.string().allow('').optional(),
    "times": Joi.string(),
    "level": Joi.string(),
    "place": Joi.string(),
    "instructor": Joi.string(),
    "responsible": Joi.string(),
    "notes": Joi.string(),
    "material": Joi.string(),
    "language": Joi.string(),
    "continuous": Joi.boolean(),
    "sport": Joi.string(),
    "sportOriginal": Joi.string(),
    "university": university,
    "link": Joi.string(),
    "dates": Joi.array().items({
        from: Joi.date(),
        to: Joi.date()
    }),
    category: category
};

module.exports = {
    university: university,
    category: category,
    course: course
};