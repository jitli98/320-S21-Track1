# Development

1. Clone the Git repository https://github.com/david-fisher/320-S21-Track1. (The name "EthiSim" will be used  throughout this document to refer to this parent directory, but any name can be used in the  actual implementation).
2. Replace .env file with specified parameters
3. Get localhost-shiboleth from slack and place it within the apache-server. This folder contains files which override shibboleth files found in the base image. These files are setup to allow the host to run only on ethisim1.cs.umass.edu.  These updated files allow the dev to run on a localhost.


### How to use docker-compose to build and run the web application

1. After following the steps outlined above, type _docker-compose up -d_ in your terminal window. The _-d_ argument stands for _detach_ and ensures that the containers spin up in the background and the terminal instance can be further used to run other commands.
2. Since we have 3 different frontend components configured in one docker-compose file, there's a possibility, albeit remote, that if we run _docker-compose up -d_, we end up getting a timeout error for the frontend services. To remedy that, restart docker and paste these 2 commands in your terminal window:
      ###### _export DOCKER_CLIENT_TIMEOUT=120_
      ###### _export COMPOSE_HTTP_TIMEOUT=120_

      The default timeout value is 60 and these commands will double it. The timeout value might need to be adjusted to an even higher value depending on your system. 
      Run _docker-compose up -d_ again.

#### The following is a list of all the containers that are run after performing the steps outlined above along with their port mappings

1. **frontend-landing-page** - this container can be accessed on http at http://localhost:3007, if using in conjunction with the **shibd** container, it should be accessed on https at https://localhost
2. **frontend-editor** - this container can be accessed on http at http://localhost:3009, if using in conjunction with the **shibd** container, it should be accessed on https at https://localhost/editor
3. **frontend-simulator** - this container can be accessed on http at http://localhost:3002, if using in conjunction with the **shibd** container, it should be accessed on https at https://localhost/simulator
4. **backend-editor** - this container can be accessed on http at http://localhost:8001, if using in conjunction with the **shibd** container, it should be accessed on https at https://localhost:8000
5. **backend-simulator** - this container can be accessed on http at http://localhost:7001, if using in conjunction with the **shibd** container, it should be accessed on https at https://localhost:7000
6. **shibd** - this container runs the customized version of the apache server that is configured to work with shibboleth. The base image for this container resides in the _ikhurana/kbtesting:apache_. However, as mentioned earlier, the shibboleth configuration files present in the base image allow shibboleth to run only on _ethisim1.cs.umass.edu_ host. Those configuration files, along with a few other apache configuration files that are provided to us by Team Atlas and are responsible for handling proxy passes from https to http as well as redirection, are overwritten with the ones present in the apache_server directory in the project. This container effectively acts as an authentication middleware and guards the routes that need to be protected as specified in the requirements. This container can be stopped in case a developer needs to disable https and/or shibboleth by typing in _docker stop shibd_ in their terminal window. In that case, the other containers will have to be accessed using their http urls. 

#### Note
##### This is the file structure for this track

##### simulator
1. frontend
2. backend
##### editor
1. frontend
2. backend
##### landing page
1. frontend

#### Not all the folders may not have a back end due to last years structure

#### How to get started
Each branch/folder has a corresponding README file containing isntructions on how to
operate and run each part of the structure. <br />
Follow the instructions there


##### If you wish to run everything at once
###### Run the landing page
1. Run back end(if applicable)
2. Run front end(if applicatble)

###### Run the simulator
1. Run back end(if applicable)
2. Run front end(if applicatble)

###### Run the editor
1. Run back end(if applicable)
2. Run front end(if applicatble)

