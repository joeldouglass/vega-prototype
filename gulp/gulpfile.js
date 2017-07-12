/**
 *  See ./readme.md for usage, configuration details, and task details.
**/

// Include gulp and plugins
const gulp   = require("gulp");
const quench = require("./quench.js");
const path   = require("path");


// tasks: can run in parallel or in series, see "user supplied keys" in quench.js
const defaultTasks = ["js", "css", "copy", "svg-sprite"];


// default configuration
// For details, see "user supplied keys" in quench.js
const defaults = {
    root: path.resolve(__dirname, "../app"),
    dest: path.resolve(__dirname, "../build"),
    tasks: defaultTasks,
    env: "development", // "development", "production", "local"
    watch: false
};

/* watch for single tasks on the command line, eg "gulp js" */
quench.singleTasks(defaults);


/**
 * development task
 * Default Task (run when you run 'gulp').
 */
gulp.task("default", function(next){

    const config = Object.assign({}, defaults, {
        env   : "development",
        watch : true,
        tasks : [defaultTasks, "browser-sync"]
    });

    quench.build(config, next);

});


/**
 * production task
 */
gulp.task("prod", function(next){

    const config = Object.assign({}, defaults, {
        env   : "production",
        watch : false
    });

    quench.build(config, next);

});


/**
 * build for development without a watcher
 */
gulp.task("build", function(next){

    const config = Object.assign({}, defaults, {
        env   : "development",
        watch : false
    });

    quench.build(config, next);

});


/**
 * development task with vm syncing
 */
gulp.task("sync", function(next){

    const config = Object.assign({}, defaults, {
        env   : "development",
        watch : true,
        tasks : [defaultTasks, "browser-sync", "vm-sync"]
    });

    quench.build(config, next);

});
