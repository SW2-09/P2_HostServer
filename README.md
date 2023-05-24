# HostServer - Gridflix

Grid Computing project at Aalborg University on 2nd semester.

## Introduction

The system aims to use an exisiting website as host website to recruit users for a browser based grid network. The system intents to minimize the host-code and focuses on communication between the grid server and the host website's users. This is a proof of concept design, in which includes a interface for users on the host server and for buyers on the grid server.
Jobs are divided into subtasks, queued and distributed among users avaiable on the host website. Failed subtasks are handled, and once all subtasks are completed they're combined into a complete solution for the buyer to download.

## Installation

Make sure to have both the GridServer and HostServer running.

1. Clone repository
2. `npm i` to install packages
3. `node server.js` to run the server

## Disclaimer

This project is provided without warranty of any kind, including, but not limited to, the implied warranties of merchantability and fitness for a particular purpose. The author(s) of this project assume no responsibility for any errors or omissions in the project or any consequences that may arise from its use. Use of this project is at your own risk.
