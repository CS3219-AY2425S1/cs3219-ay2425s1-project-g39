[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/bzPrOe11)

# PeerPrep

## Overview

## Team

Members of CS3219 Project Group 39:

- Ho Jun Hao
- Jerald Kiew
- Zoe Ang
- Li Yingming
- Jason Qiu

## Getting Started

1. Clone this repository.

```bash
git clone https://github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g39.git
cd cs3219-ay2425s1-project-g39
```

2. Add environment variables.

Add the provided secret .env folder in the root directory ```cs3219-ay2425s1-project-g39```

3. Run the docker containers.

```bash
docker compose up -d
```

Congratulations! You have successfully set up PeerPrep. :tada:

When you open up the webpage, you should see the following welcome page: 

![image](https://github.com/user-attachments/assets/927e0b91-e577-4114-93ef-98deae3533f8)

Sign up for an account with your email address and password, and use that to log in. Once you have logged in, you should see the following page: 

![image](https://github.com/user-attachments/assets/0ae11b55-65e7-42d1-8ac7-8c617cb7594e)

From here, just click on any of the questions to see their descriptions. You can filter for any topic or difficulty of your choosing using the selectors.

4. Stop and remove the docker containers and images.

```bash
docker compose up --rmi "all"
```


