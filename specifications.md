# Student Portal App

**Introduction**

The Student Portal App was an assignment originally built off another group in CIS
642 /643. Their project was originally developed for the professional program of
undergraduate CS students. Our group has been tasked with revisiting this application,
converting it to Vue, and updating it to be easier to access along with adding additional
features. With everything in place, we plan to create a more accessible location for
students, teachers, and faculty in the computer science department to interact with CS
related activities like the professional program.

**Goals**

The goals of this application are to make it easier for staff to accept, message, and
manage students request forms. Professors and administrators also see individual notes
on students, links to a student's personal GitHub and discord, and all other relevant
student information. The application will also be created such that if more additional
features are to be required in the future, they can easily be assimilated into the preexisting
code without extensive rebuilding of the base program.

**Project Overview**

As previously stated, this project will be built on a project created by a previous
team in CIS 642/643. Using this as a framework, it will be converted from a React platform
for the professional program to a Vue based platform. Besides the professional program,
there will be multiple sub-apps that are added additional along with the ability to easily add
more sub-apps in the future. This app is designed for all students, staff, and faculty in the
CS department. All users will be allowed to manage their profile and link their discord and
GitHub to their official K-State account and will have access to CS-department information
such as events, program progress, and 3rd party integrations. Students will additionally be
able to see their own course progress. Advisors will be able to view course progression of
all CS students they advise and send mass emails to advised students. Admins will have
access to the users database to manually add or disable users, as well as change access
levels.

**Development and Target Environments**

The Student Portal App is a web application. The target devices are computers and
phones and will require a network to run. As it is a server-based application, it will need to
be run on a server and remain always on, or close to it. Additionally, because it connects


with 3rd party APIs, which might be on or off independent of the app, it needs to be able to
run with or without those specific connections.

**System Model**

The web application is connected to a web server that has access to the CIS
database and the KSU CAS server. The server is responsible for maintaining security,
managing requests, and interacting with the database and external services. The client is
responsible for allowing users to interact with the Student Portal systems and sub
applications. An example of this structure can be seen in the diagram of appendix A.

The Student Portal has a main entry point as its homepage, sub applications can be
navigated to via the main router. Sub applications may also have their own routes, an
example of this is shown in appendix B.

**User Interaction**

User access will be controlled both by the information stored in the users database, as
well as the K-State CAS server, which requires a currently active K-State account to sign in
in the first place. Users signing in for the first time will have a basic account created
automatically and then can edit their profile. Access to sub-apps is dependent on which
permissions the user has in the database, such as needing to be a student or advisor to
access the professional program sub-app. Users will be able to update their profile with
their preferred name along with linking their account with their GitHub and Discord
account.

Advisors will have access to a page containing a list of all students they oversee.
From here, advisors can read and edit student notes, individually contact specific
students, or send mass emails to groups of students. Advisors will also be able to accept
or deny applications using this table along with downloading the table itself for external
use.

**Functional Requirements**

Users should have a profile automatically created based on their log in information when
first signing in to the Student Portal. From there they should be able to edit that profile at
any time. The profile will also let them connect their GitHub account and Discord, and they
can join the CS Department Discord server from the profile page. Admins should be able to
access both the user and admin level version of all apps they have access to using a slider
at the top of the page. Sub-apps should also be easy to add or remove as needed, and the
overall program will continue to function, even with no sub-apps attached.


**Nonfunctional Requirements**

As the Student Portal is a web app that needs to be accessed by many people at many
separate times, it should be able to run smoothly and format cleanly on most types of
devices, and should be able to handle computers, tablets, and phones equally well.
Additionally, since the Student Portal does handle student information, it needs to comply
with FERPA and not expose student information to anyone except the student and their
advisor. This means protecting this information from other app users and external
malicious actors. This includes the protection of any secret keys used to run specific sub-
apps like the Discord Bot host.

**Semester Goals**

The minimum viable product for this app, besides the features already implemented,
should have all features for the professional program and coursework sub-app: students
that exist in record pulled from KSIS should have their CS course information visible in the
portal, and advisors should be able to pull up this information for their advised students.
Students should also be able to submit professional program applications, which will then
be made visible for their advisor to review and approve or reject as needed. For first time
users, the profile will also have an expanded edit page, allowing them to self-report
demographic information. This information will then be changeable later at a separate part
of the profile sub-app.

An enhanced version of this app would include a new calendar sub-app, which would
allow all users to see upcoming events for the CS department and, if a member of a club,
scheduled club meetings and member only events. The calendar app would also allow
certain users, such as advisors, faculty, and club leaders, to create new events to add on
to the calendar. Finally, the advisor in charge of the CIS 018 course would be able to
denote certain events as counting for that course. It is also planned to leave the app
scalable to new sub-apps in case new applications are to be added.

**Appendix A:** _System Overview Diagram_
![Overview Diagram](./diagrams/Student%20Portal%20Diagram.drawio.png)

**Appendix B:** _Route Structure Diagram_
![Router Diagram](./diagrams/CS%20Student%20Portal%20Architecture%20Diagram.png)