/* eslint-env node */

"use strict";

var DOMAIN_NAME = "hirseNpm";

var childProcess = require("child_process");

var _domainManager;
var child;

function install() {
    child = childProcess.exec("npm install", {
        cwd: __dirname
    });
    child.stdout.on("data", function (data) {
        _domainManager.emitEvent(DOMAIN_NAME, "out", data);
    });
    child.stderr.on("data", function (data) {
        _domainManager.emitEvent(DOMAIN_NAME, "out", data);
    });
    child.on("exit", function (code) {
        _domainManager.emitEvent(DOMAIN_NAME, "installComplete", code);
    });
}

function init(domainManager) {
    _domainManager = domainManager;
    if (!domainManager.hasDomain(DOMAIN_NAME)) {
        domainManager.registerDomain(DOMAIN_NAME, {
            major: 0,
            minor: 1
        });
    }
    domainManager.registerCommand(
        DOMAIN_NAME, // domain name
        "install", // command name
        install, // command handler function
        false, // this command is synchronous in Node
        "Calls npm install"
    );

    domainManager.registerEvent(
        DOMAIN_NAME, // domain name
        "out", // event name
        [{
            name: "mesage",
            type: "string",
            description: "Message body"
        }]
    );

    domainManager.registerEvent(
        DOMAIN_NAME, // domain name
        "installComplete", // event name
        [{
            name: "code",
            type: "number",
            description: "Exit Code"
        }]
    );
}

exports.init = init;
