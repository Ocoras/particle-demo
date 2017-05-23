# A Charged Particle Simulator
An HTML demo of a charged particle travelling through magnetic and electric fields.
The main file (particle-demo.html) displays a simulation that runs in the web browser, showing a particle as it moves through electric and magnetic fields.

The colour of the particle is used to represent its charge:
- Red : Positively charged
- Blue : Negatively charged
- Green : Neutral

The default values of the simulation are used to show an example curved path, however they are unrealistic at the moment. Realistic values will be added in an update shortly.

The basic equations governing the system are:

![Governing equations](img/acc-eq.jpg)

Where we define a and b to be:

![Defining a and b](img/a-and-b-eq.jpg)

These give the solution:

![Solution](img/x-and-y-eq.jpg)

Where the constants of integration (to give the correct starting points for x and y) can be found from:

![Constants of integration](img/const-eq.jpg)
