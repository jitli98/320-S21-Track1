var env = require('node-env-file');
env(__dirname + '/.env');

/*
 * These constants are concatenated into SQL queries below, so be careful
 * WHEN IN DOUBT, PATCH CONCATENATION OUT
 */
// constants for page numbers/order
// re-order once all functions are written

const INTROPAGE = 1
const TASKPAGE = 2
const INITIAL_REFLECTION = 3
const INIT_ACTION = 4
const INIT_ACTION_SUBSEQUENT = 5
const CONVERSATION = 6
const MIDDLE_REFLECTION = 7
const FINAL_ACTION = 8
const SUMMARY_PAGE = 9
const FEEDBACK_PAGE = 10
const FINAL_REFLECTION = 11
const CONCLUSIONPAGE = 12

// constants for page types
const TYPE_PLAIN = 'PLAIN'
const TYPE_PROMPT = 'PRMPT'
const TYPE_MCQ = 'MCQ'
const TYPE_CONV = 'CONV'

const Pool = require('pg').Pool

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    max: 20,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0
})

function getScenarios(studentID, callback){
    let thisQuery= 'select scenario.id, scenario.name, scenario.description, scenario.due_date from scenario, partof, enrolled where enrolled.student_id = $1 and enrolled.course_id = partof.course_id and partof.scenario_id = scenario.id '
    
    pool.query(thisQuery, [studentID], (error,results) => {
        if (error) {

            throw error
        }
        callback(results.rows)
    })  
}

function getIntroPage(scenarioID, callback){
    let thisQuery= 'select pages.body_text from pages where pages.order = ' + INTROPAGE + 'and scenario_id = $1'
    
    pool.query(thisQuery, [scenarioID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    })  
}

function getTaskPage(scenarioID, callback){
    let thisQuery= 'select pages.body_text from conversation_task, pages where conversation_task.page_id = pages.id and pages.scenario_id = $1'
    pool.query(thisQuery, [scenarioID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    }) 
}

function getAuthenticatedInstructorDashboardSummary(instructorID, callback){
    let thisQuery= 'select scenario.id, scenario.name, scenario.description, scenario.due_date from scenario, partof, instructs where instructs.instructor_id = $1 and instructs.course_id = partof.course_id and partof.scenario_id = scenario.id '
    
    pool.query(thisQuery, [instructorID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    })  
}

function getStudentsSummary(scenarioID, callback){
    let thisQuery = 'select enrolled.student_id, submission.id from scenario, partof, enrolled, submissions where scenario.id = $1 and enrolled.course_id = partof.course_id and partof.scenario_id = scenario.id and submissions.scenario_id = scenario.id and submissions.user_id = enrolled.student_id'

    pool.query(thisQuery, [instructorID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    })  
}

function getInitReflectResponse(studentID, scenarioID, callback){
    let thisQuery= 'select prompt_response.response, prompt_response.prompt_num from prompt_response, response, submissions, pages where pages.order = '+ INITIAL_REFLECTION +' and response.page_num=pages.id and response.id= prompt_response.id and response.submission_id=submissions.id and submissions.user_id =$1 and pages.scenario_id =$2'
    pool.query(thisQuery,[studentID, scenarioID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    }) 
}

function getMidReflectResponse(studentID, scenarioID, callback){
    let thisQuery= 'select prompt_response.response, prompt_response.prompt_num from prompt_response, response, submissions, pages where pages.order = '+ MIDDLE_REFLECTION +' and response.page_num=pages.id and response.id= prompt_response.id and response.submission_id=submissions.id and submissions.user_id =$1 and pages.scenario_id =$2'
    pool.query(thisQuery,[studentID, scenarioID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    }) 
}

function getFinalReflectResponse(studentID, scenarioID, callback){
    let thisQuery= 'select prompt_response.response, prompt_response.prompt_num from prompt_response, response, submissions, pages where pages.order='+ FINAL_REFLECTION +' and response.page_num=pages.id and response.id= prompt_response.id and response.submission_id=submissions.id and submissions.user_id =$1 and pages.scenario_id =$2'
    pool.query(thisQuery,[studentID, scenarioID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    }) 
}

//Get the names, ids, and descriptions of each stakeholder in a scenario
function getStakeholders(scenarioID, callback){
    let thisQuery= 'select stakeholders.name, stakeholders.id, stakeholders.description from stakeholders where stakeholders.scenario_id =$1'
    pool.query(thisQuery, [scenarioID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    }) 
}
function getName(userID, callback){
    let thisQuery= 'select users.full_name from users where id =$1'
    pool.query(thisQuery, [userID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    }) 
}

function getCourseInfo(courseID, callback){
    let thisQuery= 'select webpage, name, semester from courses where id =$1'
    pool.query(thisQuery, [courseID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    }) 
}

function getInstructorInfo(instructorID, callback){
    let thisQuery= 'select full_name, email, webpage, course_id from instructs, users where instructs.instructor_id =$1 and users.id=$1'
    pool.query(thisQuery,[instructorID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    }) 
}

//Maybe change to addStudent and addInstructor?
function addUser(fullName, email, callback){
    let thisQuery= 'insert into users(full_name, email) values ($1 , $2)';
    pool.query(thisQuery, [fullName, email], (error,results) => {
        if (error) {
            throw error
        }
        callback('Success!')
    }) 
}

function addCourse(coursePage, courseName, semester, callback){
    let thisQuery= 'insert into courses(webpage, name, semester) values ($1, $2, $3)';
    pool.query(thisQuery, [coursePage, courseName, semester], (error,results) => {
        if (error) {
            throw error
        }
        callback('Success!')
    }) 
}

async function addReflectionResponse(studentID, input, promptNum, scenarioID, timestamp, page_order) {
    const selectPageQuery = 'select id from pages where pages.scenario_id=$1 and pages.order=$2';
    const selectSubmissionsQuery = 'select id from submissions where submissions.scenario_id=$1 and submissions.user_id=$2';
    const insertResponseQuery = 'INSERT INTO response(submission_id, page_num, time) VALUES ($1, $2, $3) ON CONFLICT (submission_id, page_num) DO UPDATE SET TIME = $3 RETURNING id';
    const insertPromptResponseQuery='insert into prompt_response(id, prompt_num, response) VALUES ($1, $2, $3) ON CONFLICT (id, prompt_num) DO UPDATE SET response = $3';
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const pageSelection = await client.query(selectPageQuery, [scenarioID, page_order]);
        let pageID = pageSelection.rows[0].id;
        const submissionSelection = await client.query(selectSubmissionsQuery, [scenarioID, studentID]);
        let submissionID = submissionSelection.rows[0].id;
        // RETURNING clause returns ID at the same time
        const responseCreation = await client.query(insertResponseQuery, [submissionID, pageID, timestamp]);
        let responseID = responseCreation.rows[0].id;
        await client.query(insertPromptResponseQuery, [responseID, promptNum, input]);
        await client.query("COMMIT");
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
}


function addInitReflectResponse(studentID, input, promptNum, scenarioID, timestamp, callback) {
    addReflectionResponse(studentID, input, promptNum, scenarioID, timestamp, INITIAL_REFLECTION).then(() => callback("Success!"));
}
function addMidReflectResponse(studentID, input, promptNum, scenarioID, timestamp, callback) {
    addReflectionResponse(studentID, input, promptNum, scenarioID, timestamp, MIDDLE_REFLECTION).then(() => callback("Success!"));
}
function addFinalReflectResponse(studentID, input, promptNum, scenarioID, timestamp, callback) {
    addReflectionResponse(studentID, input, promptNum, scenarioID, timestamp, FINAL_REFLECTION).then(() => callback("Success!"));
}

function scenarioExists(scenarioID){
    //returns True if scenarioID exists
    let thisQuery = 'select scenario.id from scenario where scenario.id = $1'
        pool.query(thisQuery, [scenarioID], (error, results) => {
            if (error){
                throw error
            }
            // TODO return if results is not zero
            return results
        })

}

// helper for createScenario
function addScenario(name, due_date, description, additional_data){
    let thisQuery = 'insert into scenario values($1, $2, $3, $5, $4)'
    pool.query(thisQuery, [name, due_date, description, additional_data, "DRAFT"], (error, results) => {
        if (error){
            throw error
        }
        return results.rows
    })

}

function createScenario(instructorID, name, due_date, description, additional_data){

}

function addScenarioToCourse(scenarioID, courseID){
    // check course exists
    // check scenario exists
    
    let thisQuery = 'insert into partof values($1, $2)'
    pool.query(thisQuery, [courseID, scenarioID], (error, results) => {
        if (error){
            throw error
        }
        return results.rows
    })
}


function scenarioPageExists(order, type, scenarioID){
    // returns pageID
    let thisQuery = 'select pages.id from pages, scenario where pages.scenario_id = $1 and pages.order = $2 and pages.type = $3'
    pool.query(thisQuery, [scenarioID, order, type], (error, results) => {
        if (error){
            throw error
        }
        // return pageID from results
        return results.rows[0].id;
    })
}

function createPage(order, type, body_text, scenarioID){
    // returns pageID if exists, else creates new
    pageID = scenarioPageExists(order, type, scenarioID)
    // TODO: handle page already existing in a better way?
    if(pageID === null){
        let thisQuery = 'insert into pages values(DEFAULT, $1, $2, $3, $4)'
        pool.query(thisQuery, [order, type, body_text, scenarioID], (error, results) => {
            if (error){
                throw error
            }
            // return pageID
            return scenarioPageExists(order, type, sceanrioID);
        })
    }
    return pageID
}

function addIntroPage(scenarioID, text, callback){
    //check scenario exists
    // upsert intro page
    if (scenarioExists(scenarioID)){
        // create page object - plain-page when no prompt linked
        pageID = createPage(INTROPAGE, TYPE_PLAIN, text, scenarioID)
        callback('Success!')
    }
    else{
        // TODO return InvalidScenarioError
        throw error
    }
}
function addInitReflectPage(scenarioID, description, prompts, callback){
    // check scenario exists
    // upsert init reflect page
    if (scenarioExists(scenarioID)){
        //create page object
        pageID = createPage(INTROPAGE, TYPE_PROMPT, description, scenarioID)
        //create prompt object
        for (p in prompts){
            let thisQuery = 'insert into prompt values($1, $2, DEFAULT)'
            pool.query(thisQuery, [pageID, p], (error, results) => {
                if (error){
                    throw error;
                }
                callback(results.rows)
            })
        }
    }
    else{
        // TODO return InvalidScenarioError
        throw error;
    }

}

function addMidReflectPage(scenarioID, description, prompts, callback){
    // check scenario exists
    // upsert mid reflect page
    if(scenarioExists(scenarioID)){
        // create page object (checks or conflicts)
        pageID = createPage(MIDDLE_REFLECTION, TYPE_PROMPT, description, scenarioID)
        // create priompt object
        for (p in prompts){
            let thisQuery = 'insert into prompt values($1, $2, DEFAULT)'
            pool.query(thisQuery, [pageID, p], (error, results) => {
                if (error){
                    throw error;
                }
                callback(results.rows)
            })
        }
    }
    else{
        // TODO return InvalidScenarioError
        throw error;
    }
}
function addFinalReflectPage(scenarioID, description, prompts, callback){
    // check scenario exists
    // upsert final reflect page
    if (scenarioExists(scenarioID)){
        // create page object (checks for conflicts)
        pageID = createPage(FINAL_REFLECTION, TYPE_PROMPT, description, scenarioID)
        //create prompt object
        for (p in prompts){
            let thisQuery = 'insert into prompt values($1, $2, DEFAULT)'
            pool.query(thisQuery, [pageID, p], (error, results) => {
                if (error){
                    throw error;
                }
                callback(results.rows)
            })
        }
    }
    else{
        // TODO return InvalidScenarioError
        throw error;
    }
}

// TODO: add body text argument to functions below?
function addConvTaskPage(scenarioID, description, callback){
    // check scenario exists
    // upsert final reflect page
    if (scenarioExists(scenarioID)){
        // create page object (checks for conflicts)
        pageID = createPage(CONVERSATION, TYPE_CONV, "", scenarioID)
        //create prompt object
        let thisQuery = 'insert into conversation_task values($1, $2)'
        pool.query(thisQuery, [pageID, description], (error, results) => {
            if (error){
                throw error;
            }
            callback(results.rows)
        })
        
    }
    else{
        // TODO return InvalidScenarioError
        throw error;
    }
}

function addConclusionPage(scenarioID, text, callback){
    //check scenario exists
    // upsert intro page
    if (scenarioExists(scenarioID)){
        // create page object - plain-page when no prompt linked
        pageID = createPage(CONCLUSIONPAGE, TYPE_PLAIN, text, scenarioID)
        callback('Success!')
    }
    else{
        // TODO return InvalidScenarioError
        throw error
    }
}


function addStakeholder(scenarioID, name, description, conversations, callback){
    // check scenario exists
    // check conversation task page exists (create if does not exist?)
    // insert stakeholder
    
    if (scenarioExists(scenarioID)){
        // create page object (checks for c)
        pageID = createPage(CONVERSATION, TYPE_CONV, "", scenarioID)
        //create conversation_task object
        let thisQuery = 'insert into stakeholders values(DEFAULT, $1, $2, NULL, $4, $5) returning id;'
        pool.query(thisQuery, [name, description, scenarioID, pageID], (error, results) => {
            if (error){
                throw error;
            }
            addStakeholderConversations(results.rows[0].id, conversations)
            callback(results.rows)
        })       
        
    }
    else{
        // TODO return InvalidScenarioError
        throw error;
    }
}

// helper function for addStakeholder
function addStakeholderConversations(stakeholderID, conversation_text_array){
    // TODO check stakeholder exists

    // insert conversations from array
    for(conv in conversation_text_array){    
        let thisQuery = 'insert into conversation values(DEFAULT, $1, $2)'
        pool.query(thisQuery, [stakeholderID, conv], (error, results) => {
            if (error){
                throw error
            }
        })
    }

    
}

function addInitActionPage(scenarioID, description, prompts, callback){
    // check scenario exists
    // upsert MCQ page
    if (scenarioExists(scenarioID)){
        // create page object
        pageID = createPage(INIT_ACTION, TYPE_MCQ, "", scenarioID)
        //create prompt object
        for (i in prompts){
            let thisQuery = 'insert into mcq values($1, $2)'
            pool.query(thisQuery, [pageID, description], (error, results) => {
                if (error){
                    throw error;
                }
                callback(results.rows)
            })
        }
    }
    else{
        // TODO return InvalidScenarioError
        throw error;
    }
}

function addFinalActionPage(scenarioID, description, prompts, callback){
    // check scenario exists
    // upsert MCQ page
    if (scenarioExists(scenarioID)){
        // create page object
        pageID = createPage(FINAL_ACTION, TYPE_MCQ, "", scenarioID)
        //create prompt object
        for (i in prompts){
            let thisQuery = 'insert into mcq values($1, $2)'
            pool.query(thisQuery, [pageID, description], (error, results) => {
                if (error){
                    throw error;
                }
                callback(results.rows)
            })
        }
    }
    else{
        // TODO return InvalidScenarioError
        throw error;
    }
}

// may be used as a helper
function addMCQQuestion(question, mcq_id){
    // TODO check for invalid parameters
    let thisQuery = 'insert into question values(DEFAULT, $1, $2)'
    pool.query(thisQuery, [question, mcq_id], (error, results) => {
        if (error){
            throw error;
        }
        callback(results.rows)
    })
}

// may be used as a helper
function addMCQOption(option, question_id){
    // TODO check for invalid parameters
    let thisQuery = 'insert into mcq_option values(DEFAULT, $1, $2)'
    pool.query(thisQuery, [option, question_id], (error, results) => {
        if (error){
            throw error;
        }
        callback(results.rows)
    })
}

function getStakeholderDescriptions(scenarioID){
    // TODO check for invalid parameters
    if (scenarioExists()){
        let thisQuery = 'select stakeholders.id, stakeholders.description from stakeholders where stakeholders.scenario_id=$1'
        pool.query(thisQuery, [scenarioID], (error, results) => {
            if (error){
                throw error;
            }
            callback(results.rows)
        })
    }
}

// Replace all these with a single helper taking an order parameter?
function getInitReflectPage(scenarioID, callback){
    let thisQuery= 'select pages.body_text, prompt.prompt, prompt.prompt_num from pages, prompt where pages.id = prompt.page_id and pages.order = '+ INITIAL_REFLECTION +' and scenario_id = $1'
    pool.query(thisQuery, [scenarioID], (error,results) => {
        if (error) {
            throw error
        }
        let response = {}
        if (results.rows.length !== 0) {
            response.prompts = results.rows.map(row => ({
                text: row.prompt,
                id: row.prompt_num
            }))
            response.body_text = results.rows[0].body_text
        }
        callback(response)
    })  
}

function getMidReflectPage(scenarioID, callback){
    let thisQuery= 'select pages.body_text, prompt.prompt, prompt.prompt_num from pages, prompt where pages.id = prompt.page_id and pages.order = '+ MIDDLE_REFLECTION +' and scenario_id = $1'
    pool.query(thisQuery, [scenarioID], (error,results) => {
        if (error) {
            throw error
        }
        let response = {}
        if (results.rows.length !== 0) {
            response.prompts = results.rows.map(row => ({
                text: row.prompt,
                id: row.prompt_num
            }))
            response.body_text = results.rows[0].body_text
        }
        callback(response)
    })  
}

function getFinalReflectPage(scenarioID, callback){
    let thisQuery= 'select pages.body_text, prompt.prompt, prompt.prompt_num from pages, prompt where pages.id = prompt.page_id and pages.order ='+ FINAL_REFLECTION +'and scenario_id = $1'
    pool.query(thisQuery, [scenarioID], (error,results) => {
        if (error) {
            throw error
        }
        let response = {}
        if (results.rows.length !== 0) {
            response.prompts = results.rows.map(row => ({
                text: row.prompt,
                id: row.prompt_num
            }))
            response.body_text = results.rows[0].body_text
        }
        callback(response)
    })  
}

//Returns question IDs as well for getChoices functions
function getInitActionPageQuestions(scenarioID, callback){
    let thisQuery= 'select question.question, question.id from pages, mcq, question where pages.id = mcq.page_id and mcq.page_id=question.mcq_id and pages.order ='+ INIT_ACTION +'and scenario_id = $1'
    pool.query(thisQuery, [scenarioID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    })  
}


function getInitActionPageChoices(scenarioID, questionId, callback){
    let thisQuery= 'select mcq_option.option from pages, mcq, mcq_option, question where mcq_option.question_id= $1 and mcq_option.question_id = question.id and pages.id = mcq.page_id and mcq.page_id=question.mcq_id and pages.order ='+ INIT_ACTION +'and scenario_id = $2'
    pool.query(thisQuery, [questionId, scenarioID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    })  
}

function getFinalActionPageQuestions(scenarioID, callback){
    let thisQuery= 'select question.question from pages, mcq, question where pages.id = mcq.page_id and mcq.page_id=question.mcq_id and pages.order ='+ FINAL_ACTION +'and scenario_id = $1'
    pool.query(thisQuery, [scenarioID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    })  
}

function getFinalActionPageChoices(scenarioID, questionId, callback){
    let thisQuery= 'select mcq_option.option from pages, mcq, mcq_option, question where mcq_option.question_id= $1 and mcq_option.question_id = question.id and pages.id = mcq.page_id and mcq.page_id=question.mcq_id and pages.order ='+ FINAL_ACTION +'and scenario_id = $2'
    pool.query(thisQuery, [questionId, scenarioID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    })  
}

async function addMCQResponse(studentID, questionID, choiceID, scenarioID, timestamp, page_order){
    const selectPageQuery = 'select id from pages where pages.scenario_id=$1 and pages.order=$2';
    const selectSubmissionsQuery = 'select id from submissions where submissions.scenario_id=$1 and submissions.user_id=$2';
    const insertResponseQuery = 'INSERT INTO response(submission_id, page_num, time) VALUES ($1, $2, $3) ON CONFLICT (submission_id, page_num) DO UPDATE SET TIME = $3 returning id';
    const insertMCQResponseQuery='INSERT INTO mcq_response(id, question_id, choice_id) VALUES($1, $2, $3) ON CONFLICT (id, question_id) DO UPDATE SET choice_id=$3;';
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const pageSelection = await client.query(selectPageQuery, [scenarioID, page_order]);
        let pageID = pageSelection.rows[0].id;
        const submissionSelection = await client.query(selectSubmissionsQuery, [scenarioID, studentID]);
        let submissionID = submissionSelection.rows[0].id;
        // RETURNING clause returns ID at the same time
        const responseCreation = await client.query(insertResponseQuery, [submissionID, pageID, timestamp]);
        let responseID = responseCreation.rows[0].id;
        await client.query(insertMCQResponseQuery, [responseID, questionID, choiceID]);
        await client.query("COMMIT");
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
}

function addInitActionResponse(studentID, questionID, choiceID, scenarioID, timestamp, callback){
    addMCQResponse(studentID, questionID, choiceID, scenarioID, timestamp, INIT_ACTION).then(() => callback("Success!"));
}
function addFinalActionResponse(studentID, questionID, choiceID, scenarioID, timestamp, callback){
    addMCQResponse(studentID, questionID, choiceID, scenarioID, timestamp, FINAL_ACTION).then(() => callback("Success!"));
}

function cb(results){
    console.log(results)
    pool.end()
}

//addInitReflectResponse(1, 'John Doe\'s first scenario initial response updated', 1, '2020-10-28 11:12:13', cb)
//addFinalReflectResponse(1, 'John Doe\'s second scenario final response', 2, '2020-10-28 11:00:00', cb)
//addFinalReflectResponse(1, 'John Doe\'s second scenario final response updated', 2, '2020-10-29 10:12:13', cb)




//getInstructorInfo(4).then(x => console.log(x[0]));
//addCourse('New Course','CS305','F2020').then(x => console.log(x));
//pool.end()

module.exports = {
    getScenarios,
    getIntroPage,
    getTaskPage,
    getAuthenticatedInstructorDashboardSummary,
    getStudentsSummary,
    getInitReflectResponse,
    getMidReflectResponse,
    getFinalReflectResponse,
    getStakeholders,
    getName,
    getCourseInfo,
    getInstructorInfo,
    addUser,
    addCourse,
    addInitReflectResponse,
    addMidReflectResponse,
    addFinalReflectResponse,
    addIntroPage,
    addInitReflectPage,
    addMidReflectPage,
    addFinalReflectPage,
    getInitReflectPage,
    getMidReflectPage,
    getFinalReflectPage,
    addStakeholder,
    addStakeholderConversations,
    addFinalActionPage,
    addConclusionPage,
    getInitActionPageQuestions,
    getInitActionPageChoices,
    getFinalActionPageQuestions,
    getFinalActionPageChoices,
    addMCQResponse,
    addInitActionResponse,
    addFinalActionResponse
}
