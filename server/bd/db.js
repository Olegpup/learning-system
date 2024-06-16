import mysql from 'mysql2/promise';
import { test_bd } from '../../config.js';

export const pool = mysql.createPool(test_bd);