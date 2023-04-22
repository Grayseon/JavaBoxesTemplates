#! /usr/bin/env node
const fs = require('fs')
const clc = require('cli-color')
const ev = require('eval')
const dgr = require('download-git-repo')
const { join } = require('path')
const args = process.argv.slice(2)
const homedir = require('os').homedir()
const glob = require('fast-glob')

var settings
if(fs.existsSync(homedir+'/jb/settings.json')){
    settings = JSON.parse(fs.readFileSync(homedir+'/jb/settings.json'))
}
if(!fs.existsSync(homedir+'/jb')){
    fs.mkdirSync(homedir+'/jb')
}
if(!fs.existsSync(homedir+'/jb/cache')){
    fs.mkdirSync(homedir+'/jb/cache')
}
if(!fs.existsSync(homedir+'/jb/settings.json')){
    fs.writeFileSync(homedir+'/jb/settings.json', '{}')
    settings = JSON.parse(fs.readFileSync(homedir+'/jb/settings.json'))
}

var commands = {}
var settingsList = {
    "Template Cache Path": ["input", homedir+'/jb/cache']
}

function addCommand(name, cb, description = "No description has been provided."){
    commands[name] = [cb, description]
}

function replace(opts, name, a, location){
    var regex = new RegExp(`(?<!\\\\)${opts.exactString ? name :`jb\{${name}\\}`}`, 'g'+(opts.caseSensitive ? '' : 'i'))
    if(opts.fileNames || opts.fileContents){
        glob([location, '**'], {
            ignore: opts.ignore ? opts.ignore : [],
            onlyFiles: true,
        })
        .then(files=>{
            files = files.slice(1)
            files.forEach(file=>{
                if(opts.fileContents){
                    if(fs.existsSync(join(location, file))){
                        fs.writeFileSync(join(location, file), fs.readFileSync(join(location, file)).toString().replace(regex, a))
                    }
                }
                if(opts.fileNames){
                    var filename = file.split('/').slice(-1)[0]
                    var absolutelocation = location + '/' + file.split('/').slice(0,-1).join('/')
                    if(fs.existsSync(join(location, file))){
                        if(regex.test(file)){
                            fs.renameSync(join(location, file), join(absolutelocation, filename.replace(regex, a)))
                        }
                    }
                }
            })
        })
    }
    if(opts.directoryNames){
        glob([location, '**'], {
            ignore: opts.ignore ? opts.ignore : [],
            onlyDirectories: true,
        })
        .then(files=>{
            files = files.slice(1)
            files.forEach(file=>{
                if(fs.existsSync(join(location, file))){
                    if(regex.test(file)){
                        fs.renameSync(join(location, file), join(location, file.replace(regex, a)))
                    }
                }
            })
        })
    }
}

function jbdownload(location){
    if(fs.existsSync(join(location, 'jbdownload.js'))){
        ev(fs.readFileSync(join(location, 'jbdownload.js')).toString(), 'jbdownload.js', {
            'variable': (name, opts = {
                fileContents: true,
                directoryNames: true,
                fileNames: true,
                exactString: false,
                caseSensitive: false,
                ignore: []
            }, cb = ()=>{}, prompt = name+':\n')=>{
                const readline = require('readline')
                const rl = readline.createInterface({input: process.stdin, output: process.stdout})

                rl.question(prompt, (a)=>{
                    rl.close()
                    cb(a)
                    replace(opts, name, a, location)
                })
            },
            'prompt': (prompt, cb = ()=>{})=>{
                const readline = require('readline')
                const rl = readline.createInterface({input: process.stdin, output: process.stdout})

                rl.question(prompt, (a)=>{
                    rl.close()
                    cb(a)
                })
            },
            'replace': (name, opts, a)=>{
                replace(opts, name, a, location)
            }
        }, false)
    }
}

addCommand('help', (cmd)=>{
    if(cmd[0]){
        console.log(commands[cmd[0]][1])
    }else if(!cmd[0]){
        Object.keys(commands).forEach(ofcmd=>{
            console.log(clc.bgRedBright(ofcmd))
            console.log('>   '+commands[ofcmd][1].replace(/\n/g, '\n>   '))
        })
    }else{
        console.log('\''+cmd[0]+'\' is not a command!')
    }
}, 'Gets help from a command.\nUsage: help [command?]')

addCommand('add', (args)=>{
    let template = args[0]
    let location = args[1] ? args[1] : process.cwd()
    console.log('Downloading...')
    dgr(template, location, null, ()=>{
        console.log('Successfully downloaded!')
        jbdownload(location)
    })
}, 'Installs a template to a location.\nUsage: add [template name] [path?]')

addCommand('execute', (args)=>{
    let location = args[0] ? args[0] : process.cwd()
    jbdownload(location)
}, 'Execute a jbdownload.js file.\nUsage: execute [location?]')

addCommand('settings', (args)=>{
    console.log('not done yet')
}, 'Adjust or view your settings.\nFor interface: settings\nAdjust a command from arguments: settings [setting name] [value?]')

function run(){
    if(Object.keys(commands).includes(args[0])){
        commands[args[0]][0](args.slice(1))
    }else if(!args[0]){
        /*console.log(`Welcome to JavaBoxes. Type ${clc.bgBlackBright(' help ')} to see a list of commands. Press ${clc.bgBlackBright(' ctrl+c ')} to exit.`)
        input()*/
        commands['help'][0]([])
    }else{
        console.log(`'${args[0]}' is not a command.`)
    }
}
run()