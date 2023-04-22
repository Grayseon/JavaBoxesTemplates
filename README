# JavaBoxesTemplates

## MANUAL INSTALLATION
1. Download one of the files from `build` for your operating system.

### Mac
2. Place the file in usr/local/bin
### Windows
2. Add the Downloads folder (or what ever directory the file is downloaded in) to your Path.
### Linux
2. Place the file in user/local/bin  

3. Finally, test if it's working by running
`jb help`

## INSTALLATION VIA NPM
Installing via npm only requires you to run this:
`npm i javaboxes -g`  
In a terminal, type `jb help` to test if it's working.


## BUILD FROM SOURCE
Source code can be found in `files`.
1. Install the pkg module from npm. `npm i pkg -g`
2. Download the source code
3. In the directory of the source code, run `pkg package.json`.

## TESTING
There is a sample repository found at `Grayseon/jbtt`.
To test it, run `jb add Grayseon/jbtt` and follow the prompts.
When done, it should have applied the edits. Notice in `main/assets/jb{id} cover.txt` it does not affect variables that have backslashes before them.


## JBDOWNLOAD.JS
`jbdownload.js` is the brains to the template you are installing. `require()` statements are disabled to prevent malicious use.
There are 4 new things.

### variable(name, options?, cb?, prompt?)
`variable()` is a fast way to prompt and replace. The name is what variable it will be replacing. By default, your prompt is the name of the variable. The answer provided by the user gets passed in the callback.
Example:
```
variable("id", {
    fileContents: true,
    fileNames: true,
    directoryNames: true,
    exactString: false
}, ()=>{
    console.log('done')
})
```
Multiple variables should be nested in callbacks.
```
variable("id", {
    fileContents: true,
    fileNames: true,
    directoryNames: true,
    exactString: false
}, ()=>{
    variable("name", {
        fileContents: true,
        fileNames: true,
        directoryNames: true,
        exactString: false
    }, ()=>{
        console.log('done')
    })
})
```

### prompt(name, cb?)
`prompt()` will ask the user anything, and it does not have to be used to replace something. This is helpful for if you have 2 variables that you want to set as the same value. The answer provided by the user gets passed in the callback.
Example:
```
prompt("name a different word to replace \"this\"", (a)=>{
    replace("this", {
        fileContents: true,
        fileNames: true,
        directoryNames: true,
        exactString: true
    }, a)
})
```
Multiple prompts should be nested in callbacks as shown in variables.

### replace(name, options, answer)
`replace()` is a method used to replace something in a folder as if it is being used in a variable. `replace()` does not necessarily need to be used after a prompt, but it is implemented for that purpose. It could, though, change the header in a file to the date that it was created automatically.
Example:
```
replace("this", {
    fileContents: true,
    fileNames: true,
    directoryNames: true,
    exactString: true
}, "that")
```

### options
`options` is an object and the configuration used to replace things.
Defaults:
```
{
    fileContents: true,
    directoryNames: true,
    fileNames: true,
    exactString: false,
    caseSensitive: false,
    ignore: []
}
```
`fileContents` specifies whether or not you want the contents of the files to be replaced.  
`directoryNames` specifies whether or not you want the names of directories to be replaced.  
`fileNames` specifies whether or not you want the names of the files to be replaced.  
`exactString` can be used to replace something that is not meant to be a varible for JavaBoxes (that uses jb{variable}), such as a keyword like   "hashbrown" When it is true, the name acts as the thing to replace. A code example can be seen in the `prompt` example.  
`caseSensitive` specifies whether or not you want the search to match things with different casing.  
`ignore` can contain a list of blobs (example: `**/assets/*.png`) that it will ignore.  
