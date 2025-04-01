#!/usr/bin/env python3

'''
*****************************************
 PiFire PID Controller
*****************************************

 Description: This object will be used to calculate PID for maintaining
 temperature in the grill.  This controller adds basic clamping to prevent windup.
 When the output is saturated (either below 0 or above 1) then we do not increase the integral output.
 https://info.erdosmiller.com/blog/pid-anti-windup-techniques

 This software was developed by GitHub user DBorello as part of his excellent
 PiSmoker project: https://github.com/DBorello/PiSmoker

 Adapted for PiFire

 PID controller based on proportional band in standard PID form https://en.wikipedia.org/wiki/PID_controller#Ideal_versus_standard_PID_form
   u = Kp (e(t)+ 1/Ti INT + Td de/dt)
  PB = Proportional Band
  Ti = Goal of eliminating in Ti seconds
  Td = Predicts error value at Td in seconds
  
  Configuration Defaults: 
  "config": {
      "PB": 60.0,
      "Td": 45.0,
      "Ti": 180.0,
      "center": 0.5
   }

*****************************************
'''

'''
Imported Libraries
'''
import time
from controller.base import ControllerBase 

'''
Class Definition
'''
class Controller(ControllerBase):
	def __init__(self, config, units, cycle_data):
		super().__init__(config, units, cycle_data)

		self._calculate_gains(config['PB'], config['Ti'], config['Td'])

		self.p = 0.0
		self.i = 0.0
		self.d = 0.0
		self.u = 0

		self.last_update = time.time()
		self.error = 0.0
		self.set_point = 0

		self.center = config['center']

		self.derv = 0.0
		self.inter = 0.0

		self.last = 150

		self.set_target(0.0)

	def _calculate_gains(self, pb, ti, td):
		if pb == 0:
			self.kp = 0
		else:
			self.kp = -1 / pb
		if ti == 0:
			self.ki = 0
		else:
			self.ki = self.kp / ti
		self.kd = self.kp * td

	def update(self, current):
		# P
		error = current - self.set_point
		self.p = self.kp * error

		# D
		self.derv = (current - self.last) / dt
		self.d = self.kd * self.derv

		# I
		dt = time.time() - self.last_update
		# Clamping anti-windup method.  if we are at saturation, either fully on or fully off, then don't change the integral.
		if not ((self.p + self.d) >= 1 and (self.p + self.d) <= 0):
			self.inter += error * dt
		
		self.i = self.ki * self.inter

		# PID
		self.u = self.p + self.i + self.d

		# Update for next cycle
		self.error = error
		self.last = current
		self.last_update = time.time()

		return self.u

	def set_target(self, set_point):
		self.set_point = set_point
		self.error = 0.0
		self.inter = 0.0
		self.derv = 0.0
		self.last_update = time.time()

	def set_gains(self, pb, ti, td):
		self._calculate_gains(pb,ti,td)


	def get_k(self):
		return self.kp, self.ki, self.kd
	
	def supported_functions(self):
		function_list = [
			'update', 
	        'set_target', 
	        'get_config', 
			'set_gains', 
			'get_k'
        ]
		return function_list
