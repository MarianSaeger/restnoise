'use strict';

global.sinon = require("sinon");
global.chai = require("chai");
global.should = require("chai").should();
global.expect = require("chai").expect;
global.rewire = require("rewire");
global.AssertionError = require("chai").AssertionError;

var sinonChai = require("sinon-chai");
global.chai.use(sinonChai);
