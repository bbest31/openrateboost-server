'use strict';
const { claimIncludes } = require('express-oauth2-jwt-bearer');


/**
 * The following functions are to check the permissions of the users to be able
 * to perform CRUD operations on the resources using the Management API.
 * 
 * If the endpoint is not triggered by the user, the checkJwt middleware will
 * ensure that the jwt token is valid and the user is authenticated.
 */

/**
 * Check if user has permission to perform an operation on a resource
 * @param {string} operation - create, read, update, delete 
 * @param {string} resource - the resource to check permission for
 * @returns 
 */
const checkPermission = (operation, resource) => {
  return claimIncludes('permissions', `${operation}:${resource}`);
};

/**
 * Check if user has permission to create a resource
 * @param {string} resource - the resource to check permission for
 * @returns 
 */
const checkCreatePermission = (resource) => {
  return checkPermission('create', resource);
};

/**
 * Check if user has permission to read a resource
 * @param {string} resource 
 * @returns 
 */
const checkReadPermission = (resource) => {
  return checkPermission('read', resource);
};

/**
 * Check if user has permission to update a resource
 * @param {string} resource 
 * @returns 
 */
const checkUpdatePermission = (resource) => {
  return checkPermission('update', resource);
};

/**
 * Check if user has permission to delete a resource
 * @param {string} resource 
 * @returns 
 */
const checkDeletePermission = (resource) => {
  return checkPermission('delete', resource);
};

module.exports = { checkCreatePermission, checkReadPermission, checkUpdatePermission, checkDeletePermission };
