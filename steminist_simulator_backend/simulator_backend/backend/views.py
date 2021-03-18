from django.shortcuts import render
from django.core.serializers import serialize
from django.http import HttpResponse, JsonResponse, HttpResponseForbidden, HttpResponseNotFound, HttpResponseBadRequest
import backend.models as md
import json
import logging
from datetime import datetime
import backend.queries as queries
import time # possible change of library


INTROPAGE = 1
TASKPAGE = 2
INITIAL_REFLECTION = 3
INIT_ACTION = 4
INIT_ACTION_SUBSEQUENT = 5
CONVERSATION = 6
MIDDLE_REFLECTION = 7
FINAL_ACTION = 8
SUMMARY_PAGE = 9
FEEDBACK_PAGE = 10
FINAL_REFLECTION = 11
CONCLUSIONPAGE = 12

# Create your views here.
"""def err_json_res(status, err):
    return JsonResponse({'status':int(status), 'error':err})"""

def index(request):
    return HttpResponse("This is the API")


def scenarios(request):
    data = request.GET
    studentID = data['studentId']

    if not isinstance(studentID, int):
        print("Invalid student ID")
        return HttpResponseBadRequest('Invalid student ID: %s' %str(studentID))
    else:
        try:
            scenarioQuerySet = md.Scenario.objects.filter(id=studentID)
            # If no scenarios with the given studentId were found, return 404 error
            if len(scenarioQuerySet) == 0:
                return HttpResponseNotFound('Scenario not found with the given studentId')

            resultData = (list(scenarioQuerySet.values()))

        except Exception as ex:
            logging.exception("Exception thrown: Query Failed to retrieve Scenario")

        print("Got all scenarios")
        return JsonResponse({'status':200, 'result': resultData}, content_type="application/json")


def scenarioIntroduction(request):
    data = request.GET
    scenarioID = data['scenarioId']

    if not isinstance(scenarioID, int):
        print("Invalid ID")
        return HttpResponseBadRequest('Invalid scenario ID: %s' %str(scenarioID))
    else:
        try:
            scenarioIntroQuerySet = md.Page.objects.filter(order=INTROPAGE, scenario_id=scenarioID)
            # If no pages with the given scenarioId and order were found, return 404 error
            if len(scenarioIntroQuerySet) == 0:
                return HttpResponseNotFound('Page not found with the given scenarioId')

            resultData = (list(scenarioIntroQuerySet.values()))

        except Exception as ex:
            logging.exception("Exception thrown: Query Failed to retrieve Page")

        print("Got scenario introduction.")
        return JsonResponse({'status':200, 'result': resultData}, content_type="application/json")


def scenarioTask(request):
    data = request.GET
    scenarioID = data['scenarioId']

    if not isinstance(scenarioID, int):
        print("Invalid ID")
        return HttpResponseBadRequest('Invalid scenario ID: %s' % str(scenarioID))
    else:
        try:
            scenarioTaskQuerySet = md.Page.objects.filter(order=TASKPAGE, scenario_id=scenarioID)
            # If no pages with the given scenarioId and order were found, return 404 error
            if len(scenarioTaskQuerySet) == 0:
                return HttpResponseNotFound('Page not found with the given scenarioId')

            resultData = (list(scenarioTaskQuerySet.values()))

        except Exception as ex:
            logging.exception("Exception thrown: Query Failed to retrieve Page")

        print("Got scenario introduction.")
        return JsonResponse({'status': 200, 'result': resultData}, content_type="application/json")


def initialReflection(request):

    if request.method == 'GET':
        data = request.GET
        scenarioID = data['scenarioId']

        if not isinstance(int(scenarioID), int):
            print("Invalid scenario ID")
            return HttpResponseBadRequest('Invalid scenario ID: %s' % str(scenarioID))

        resultData = None
        try:
            scenarioReflectionQuerySet = md.Page.objects.filter(order=INITIAL_REFLECTION, scenario_id=scenarioID)
            # If no pages with the given scenarioId and order were found, return 404 error
            # print(len(scenarioReflectionQuerySet))
            # if len(scenarioReflectionQuerySet) == 0:
            #     return HttpResponseNotFound('Page not found with the given scenarioId')
            # resultData = (list(scenarioReflectionQuerySet.values()))

            resultData = {
                "prompts": [
                    {
                        "text": "Initial reflection prompt",
                        "id": 1
                    }
                ],
                "body_text": "Body text before initial reflection"
            }
        except Exception as ex:
            logging.exception('Exception thrown: Query Failed to retrieve Page')

        print("Got initial reflection.")
        return JsonResponse({'status': 200, 'result': resultData}, content_type="application/json")

    elif request.method == 'POST':
        data = request.POST
        scenarioID = data['scenarioId']
        if not isinstance(scenarioID, int):
            print("Invalid scenario ID")
            return HttpResponseBadRequest('Invalid scenario ID: %s' % str(scenarioID))
        studentID = data['studentId']
        no_error = True
        if not isinstance(studentID, int):
            print("Invalid student ID")
            return HttpResponseBadRequest('Invalid student ID: %s' % str(studentID))

        timestamp = datetime.now()
        for prompt_num in data:
            if not isinstance(prompt_num, int):
                print("Invalid prompt number")
                return HttpResponseBadRequest('Invalid prompt number: %s' % str(prompt_num))

            inputData = data
            no_error = queries.addReflectionResponse(studentID, inputData, prompt_num, scenarioID, timestamp)

        if no_error:
            print("Updated initial reflection.")
            return JsonResponse({'status': 200, 'result': resultData}, content_type="application/json")
        else:
            print("Initial reflection not added")
            return HttpResponseNotFound('student ID, scenario ID or prompt does not exist in database.')

        

def scenarioInitialReflectionResponse(request):
        if request.method == 'GET':
            jsonData = json.loads(request.body)
            scenarioID = jsonData['scenarioID']
            studentID = jsonData['studentID']

            if not isinstance(scenarioID, int):
                print("Invalid ID")
                return HttpResponseBadRequest('Invalid scenario ID: %s' % str(scenarioID))
            if not isinstance(studentID, int):
                print("Invalid ID")
                return HttpResponseBadRequest('Invalid student ID: %s' % str(studentID))
            else:
                try:
                    # scenarioInitialReflectionQuerySet = md.Page.objects.filter(order = INITIAL_REFLECTION, scenario_id = scenarioID, student_id = studentID)
                      
                    #if (scenarioInitialReflectionQuerySet) == None:
                    # return HttpResponseNotFound('No initial reflection response found with one or both of the IDs')
                        
                    #resultData = list(scenarioInitialReflectionQuerySet.values())
                    resultData = [
                        {
                            "prompt_id": 1,
                            "response": "I think that we should proceed with this....."
                        }
                    ]

                    return JsonResponse({'status':200, 'result': resultData}, content_type="application/json")

                except Exception as ex:
                    logging.exception("Exception thrown: Query Failed to retrieve Page")
                
def scenarioInitialAction(request):
    if request.method == 'GET':
        # data = request.GET
        # scenarioID = data['scenarioId']
        jsonData = json.loads(request.body)
        scenarioID = jsonData['scenarioId']

        if not isinstance(scenarioID, int):
            print("Invalid ID")
            return HttpResponseBadRequest('Invalid scenario ID: %s' % str(scenarioID))
        else:
            try:
                scenarioInitialActQuerySet = md.Page.objects.filter(order= INIT_ACTION, scenario_id=scenarioID)

                # if len(scenarioInitialActQuerySet) == 0:
                #     return HttpResponseNotFound('No initial actions = found with the given scenarioId')

                # resultData = list(scenarioInitialActQuerySet.values())
                resultData = [
                    {
                        "question_id": 1,
                        "question": "Do you want to make a decision before speaking to stakeholders?",
                        "option_id": [1, 2],
                        "option": ["Approve Decision without talking to stakeholders", "Postpone decision to talk to stakeholders"]
                    }
                ]

                return JsonResponse({'status':200, 'result': resultData}, content_type="application/json")

            except Exception as ex:
                logging.exception("Exception thrown: Query Failed to retrieve Page")

    elif request.method == 'POST':
        jsonData = json.loads(request.body)
        scenarioID = jsonData['scenarioID']
        studentID = jsonData['studentID']
        # data = jsonData['data']
        
        if not isinstance(scenarioID, int):
            print("Invalid scenario ID")
            return HttpResponseBadRequest('Invalid scenario ID: %s' % str(scenarioID))
        elif not isinstance(studentID, int):
            print("Invalid student ID")
            return HttpResponseBadRequest('Invalid student ID: %s' % str(studentID))
        else:
            timestamp = time.time() # get time stamp, i'm using time rn but can change to any library as fits
            
            # POST data
            postData = [
                {
                    "student_id": 1,
                    "question_id": 1,
                    "choice_id": 2,
                    "scenario_id": 1,
                    "timestamp": 1594819641.9622827,
                }
            ]
            
            initialActionQuery = [0, 1] # query for all possible choices for scenario_id and question_id
            # if not(1 in initialAction): # change to choice_id instead of 1
            #     return HttpResponseBadRequest('Invalid choice ID: %s' % str(1))
                
            # post to database function here!!
            
            return JsonResponse({'status': 200, 'result': 'success'}, content_type="application/json")
