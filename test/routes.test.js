/**
 * Created by MUHAMAD on 07/24/2017.
 */
const expect = require('expect');
const supertest = require('supertest');
const {app} = require('../server');
const {Token} = require('../models/Token');
const axios = require('axios');
