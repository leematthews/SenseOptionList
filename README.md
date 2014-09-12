SenseOption
===========

An Option List visualisation for Qlik Sense - allows selection of an option from a horizontal list. 
The selected option value can be used to drive things like: 

- cyclic dimensions (see example screen shots below)
- conditional dimensions or measures, (although these are not available in Sense you can mimic them with nested if() expressions)
- filtering data
 
..and whatever else you can think of.

ISSUES:
-------
At this stage it is not reading the left hand side label text from the field in the configuration. I dont understand why. So its hard coded for the moment.

![selectbreed](https://cloud.githubusercontent.com/assets/8730341/4229342/0dccf458-396e-11e4-9f2c-e911659c585b.png)

![selectsize](https://cloud.githubusercontent.com/assets/8730341/4229348/266cb58e-396e-11e4-8d83-7027bba45534.png)

