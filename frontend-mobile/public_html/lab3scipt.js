
//GLOBAL VARIABLES

/* global fetch, Vue */
window.log = false;
var people = [];
var sidebar = false;
var editing = false;
var deleting = false;
var prevpost = -1;
var Pname = "";
var Ptext = "";
var Pimp = 5;
var Pcolour = "#000000";
var currentpost = -2;
var Token = null;

//Functions

//Hide Font


function HideFont() {
    var Font = document.getElementsByClassName('Font');
    var FontSize = document.getElementsByClassName('FontSize');
    for (i = 0; i < Font.length; i++)
    {
        Font.item(i).style.display = "none";
        FontSize.item(i).style.display = "none";
    }
}


//Change Sort
function ChangeSort(sorter) {
    var changeIcon = document.getElementById(sorter);
    if (!changeIcon.classList.contains('color-red')) {
        changeIcon.classList.add('color-red');
    } else {
        changeIcon.classList.remove('color-red');
    }
}

//Enable/Disable Functions

function EnDisable(id, EnDi) {
    id.querySelector('.noteName').disabled = EnDi;
    id.querySelector('.Font').disabled = EnDi;
    id.querySelector('.noteText').disabled = EnDi;
    id.querySelector('.noteImp').disabled = EnDi;
    id.querySelector('.iconsC').disabled = EnDi;
}


//CRUD OPERATIONS

function DeleteSend(ID) {
    ID = ID.toString();
    var url = "http://ec2-34-221-83-233.us-west-2.compute.amazonaws.com:5000/api/notes/" + ID;

    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url);

    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Authorization", "Bearer " + Token);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }
    };

    xhr.send();
}


function Update(post) {
    ID = post.id;
    var url = "http://ec2-34-221-83-233.us-west-2.compute.amazonaws.com:5000/api/notes/" + ID;

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", url);

    xhr.setRequestHeader("Authorization", "Bearer " + Token);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }
    };
    var data = `{
  "id": ` + post.id + `,
  "name": "` + post.name + `",
  "text": "` + post.text + `",
  "colour": "` + post.colour + `",
  "font_size": ` + post.font_size + `,
  "x_coordinate": ` + post.x_coordinate + `,
  "y_coordinate": ` + post.y_coordinate + `,
  "width": ` + post.width + `,
  "height": ` + post.height + `,
  "importance":` + post.importance + `,
  "favourite": ` + post.favourite + `
}`;
    xhr.send(data);
}


function Create() {
    var url = "http://ec2-34-221-83-233.us-west-2.compute.amazonaws.com:5000/api/notes";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Authorization", "Bearer " + Token);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            var x = xhr.responseText;
            var newID = JSON.parse(x).id;
            people.push((({id, name, text, importance, favourite, colour, font_size, height, width, x_coordinate, y_coordinate}) =>
                ({id, name, text, importance, favourite, colour, font_size, height, width, x_coordinate, y_coordinate}))
                    ({id: newID, name: "NoteName", text: "Text", importance: 5, favourite: false, colour: "#000000", font_size: 12, height: 250, width: 300, x_coordinate: 500, y_coordinate: 500}));
        }
    };

    var data = `{
  "id": 0,
  "name": "NoteName",
  "text": "Text",
  "colour": "#000000",
  "font_size": 12,
  "x_coordinate": 500,
  "y_coordinate": 500,
  "width": 300,
  "height": 250,
  "importance": 5,
  "favourite": false
}`;
    xhr.send(data);
}



//VUE COMPONENT FOR DISPLAY NOTES

Vue.component("blog-post", {
    props: ["post"],
    template: `
    <div @click="edit(post)" class="comp">
        <div @click="edit(post)" class="cloud">
            <div @click="edit(post)" class="cloud_bottom rcorners"  v-bind:style="{ color: post.colour }">
                <span @click="like(post)" class="favor center iconsNotes icons-white icons- animate glyphicon glyphicon-heart"></span>
                <span @click="sa(post)" class="save center iconsNotes icons-white icons- animate glyphicon glyphicon-edit"></span>
                <span @click="del(post)" class="del center iconsNotes icons-white icons- animate glyphicon glyphicon-trash"></span>
                <input class="noteName" v-model.trim=post.name disabled>
                <textarea class="noteText" v-model=post.text disabled v-bind:style="{ fontSize: post.font_size + 'px' }"></textarea>
                <span class="FontSize">Fontsize:</span>
                <input type="number" class="Font" name="quantity"  v-model=post.font_size disabled=true>
                <div class="cloud_left" v-bind:style="{ backgroundColor: post.colour }"></div>
                <div class="cloud_mid" v-bind:style="{ backgroundColor: post.colour }"></div>
                <div class="cloud_right" v-bind:style="{ backgroundColor: post.colour }"></div>
                <div class="cloud_top" v-bind:style="{ backgroundColor: post.colour }"></div>
                <div class="cloud_top2 center" v-bind:style="{ color: post.colour }">
                    <span class="I">!!:</span>
                    <input type="number" class="noteImp" name="quantity" min="0" max="5"  v-model.trim=post.importance disabled>
                </div>
                <div class="center">
                    <input class="iconsC icons-white icons- animate" disabled type="color" id="favcolor" name="favcolor" value="post.colour" v-model.trim=post.colour v-bind:style="{backgroundColor: post.colour }">
                </div>
            </div>
        </div>

            <div id="myModal" class="modal">
                <div class="modal-content">
                    <p>Keep changes made to note?</p>
                    <div @click="keep(post)" onclick="" class="sabtn sabtn-white sabtn- animate back-green">Keep Changes</div>
                    <div @click="discard(post)" onclick="" class="sabtn sabtn-white sabtn- animate back-red">Discard</div>
                </div>
            </div>
    </div>
    `,
    methods: {
        edit: function (post) {//run when note is clicked
            closeSidebar();
            sidebar = false;
            var id = document.getElementById(post.id);
            if (id !== null) {
                if (currentpost !== post.id && deleting) {
                    deleting = false;
                    var delbut = document.querySelectorAll('.del');
                    for (i = 0; i < delbut.length; i++)
                    {
                        if (!delbut[i].classList.contains('glyphicon-trash')) {
                            delbut[i].classList.add('glyphicon-trash');
                        }
                        delbut[i].classList.remove('color-red');
                        delbut[i].classList.remove('glyphicon-ok');
                    }
                }

                var allComps = document.getElementsByClassName('comp');
                for (i = 0; i < allComps.length; i++)
                {
                    allComps.item(i).style.opacity = 0.5;
                }
                id.style.opacity = 1;

                var allComps = document.getElementsByClassName('noteName');
                for (i = 0; i < allComps.length; i++)
                {
                    allComps.item(i).style.opacity = 1;
                }


                var allNoteTexts = document.getElementsByClassName('noteText');
                for (i = 0; i < allComps.length; i++)
                {
                    allNoteTexts.item(i).style.display = "none";
                    allNoteTexts.item(i).style.opacity = 1;
                }
                id.querySelector('.noteText').style.display = "flex";


                closeSidebar();
                if (editing && post.id !== prevpost) {
                    if (prevpost !== -1) {
                        var modal = id.querySelector(".modal");
                        modal.style.display = "flex";
                    }
                } else {
                    var allIconC = document.getElementsByClassName('iconsC');
                    for (i = 0; i < allIconC.length; i++)
                    {
                        allIconC.item(i).style.display = "none";
                    }
                    id.querySelector('.iconsC').style.display = "flex";
                    var allIconNotes = document.getElementsByClassName('iconsNotes');
                    for (i = 0; i < allIconNotes.length; i++)
                    {
                        allIconNotes.item(i).style.visibility = "hidden";
                    }
                    var clid = id.querySelectorAll('.iconsNotes');
                    for (i = 0; i < clid.length; i++)
                    {
                        clid.item(i).style.visibility = "visible";
                    }

                    if (post.favourite === true) {
                        var id = document.getElementById(post.id);
                        var sabut = id.querySelector('.favor');
                        if (!sabut.classList.contains('color-pink')) {
                            sabut.classList.remove('icons-white');
                            sabut.classList.add('color-pink');
                        }
                    }
                }
                currentpost = post.id;
            }
        },
        sa: function (post) {//save changes made to note
            var id = document.getElementById(post.id);
            id.querySelector('.Font').style.display = "inline";
            id.querySelector('.FontSize').style.display = "inline";

            Pname = post.name;
            Ptext = post.text;
            Pimp = post.importance;
            prevpost = post.id;
            pcolour = post.colour;
            var id = document.getElementById(post.id);
            var sabut = id.querySelector('.save');
            if (sabut.classList.contains('glyphicon-edit')) {
                EnDisable(id, false);
                sabut.classList.remove('glyphicon-edit');
                sabut.classList.add('glyphicon-ok');
                editing = true;
            } else {
                if (Token !== null) {
                    Update(post);
                }
                editing = false;
                EnDisable(id, true);
                sabut.classList.remove('glyphicon-ok');
                sabut.classList.add('glyphicon-edit');

                HideFont();
            }
        },
        del: function (post) {//delete specific note
            var id = document.getElementById(post.id);
            var delbut = id.querySelector('.del');
            if (delbut.classList.contains('glyphicon-trash')) {
                deleting = true;
                delbut.classList.remove('glyphicon-trash');
                delbut.classList.add('glyphicon-ok');
                delbut.classList.add('color-red');
            } else {
                if (Token !== null) {
                    DeleteSend(post.id);
                }
                deleting = false;
                delbut.classList.add('glyphicon-trash');
                delbut.classList.remove('glyphicon-ok');
                delbut.classList.remove('color-red');
                for (j = 0; j < app.posts.length; j++) {
                    if (app.posts[j]['id'] === post.id) {
                        const index = app.posts.indexOf(app.posts[j]);
                        app.posts.splice(j, 1);
                    }
                }
                if (people.length < 3) {
                    document.getElementById("buffer").style.backgroundColor = "#002e4b";
                    document.body.style.backgroundImage = "linear-gradient(#002e4b, #002e4b)";
                }
            }

        },
        like: function (post) {//change to liked and save changes to note
            if (Token !== null) {
                Update(post);
            }
            var id = document.getElementById(post.id);
            var sabut = id.querySelector('.favor');
            for (postchange of app.posts) {
                if (postchange['id'] === post.id) {
                    if (post.favourite === true) {
                        sabut.classList.remove('color-pink');
                        sabut.classList.add('icons-white');
                    } else {
                        sabut.classList.remove('icons-white');
                    }
                    postchange['favourite'] = !postchange['favourite'];
                }
            }
        },
        keep: function (post) {//keep changes
            if (Token !== null) {
                Update(post);
            }
            var id = document.getElementById(prevpost);
            var sabut = id.querySelector('.save');
            editing = false;
            deleting = false;
            EnDisable(id, true);
            sabut.classList.remove('glyphicon-ok');
            sabut.classList.add('glyphicon-edit');
            var id = document.getElementById(post.id);
            var modal = id.querySelector(".modal");
            modal.style.display = "none";
            HideFont();
        },
        discard: function (post) {//discrad changes if this option is chosem
            var id = document.getElementById(prevpost);
            var sabut = id.querySelector('.save');
            editing = false;
            deleting = false;
            sabut.classList.add('glyphicon-edit');
            for (postchange of app.posts) {
                if (postchange['id'] == prevpost) {
                    postchange['name'] = Pname;
                    postchange['text'] = Ptext;
                    postchange['importance'] = Pimp;
                    postchange['colour'] = Pcolour;
                }
            }
            EnDisable(id, true);
            var id = document.getElementById(post.id);
            var modal = id.querySelector(".modal");
            modal.style.display = "none";
            HideFont();
        }
    }
});




//VUE USED TO STORE NOTES



var app = new Vue({
    el: '#app',
    data: {
        posts: [],
        currentSort: 'name',
        currentSortDir: 'asc',
        onlyfavs: false
    },
    computed: {
        likes: function () {
            var favpost = [];
            for (post of this.posts) {
                if (this.onlyfavs === true) {
                    if (post['favourite'] === true) {
                        favpost.push(post);
                    }
                } else {
                    favpost.push(post);
                }
            }
            return favpost;
        }
    },

    created: function () {
        fetch("Notes.json")
                .then(response => response.json())
                .then((data) => {
                    data.forEach(function (person) {
                        people.push((({id, name, text, importance, favourite, colour, font_size, height, width, x_coordinate, y_coordinate}) =>
                            ({id, name, text, importance, favourite, colour, font_size, height, width, x_coordinate, y_coordinate}))(person));
                    });
                })
                .catch(function (err) {
                    console.log(err);
                });
        this.posts = people;
    },

    methods: {
        sort: function (s) {
            closeSidebar();
            if (!editing && !deleting) {
                var allIconNotes = document.getElementsByClassName('iconsNotes');
                var allComps = document.getElementsByClassName('comp');
                for (i = 0; i < allIconNotes.length; i++)
                {
                    allIconNotes.item(i).style.visibility = "hidden";
                }
                for (i = 0; i < allComps.length; i++)
                {
                    allComps.item(i).style.opacity = 1;
                }
                var allIconC = document.getElementsByClassName('iconsC');
                for (i = 0; i < allIconC.length; i++)
                {
                    allIconC.item(i).style.display = "none";
                }


                if (s === this.currentSort) {
                    this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
                }
                this.currentSort = s;


                ChangeSort(s);


                this.posts = this.posts.sort((a, b) => {
                    let modifier = 1;
                    if (this.currentSortDir === 'desc')
                        modifier = -1;
                    if (a[this.currentSort] < b[this.currentSort])
                        return -1 * modifier;
                    if (a[this.currentSort] > b[this.currentSort])
                        return 1 * modifier;
                    return 0;
                }
                );
            }
        },
        add: function () {
            closeSidebar();
            Create();
        },
        fav: function () {
            closeSidebar();
            ChangeSort("favourite");

            if (!editing && !deleting) {
                this.onlyfavs = !this.onlyfavs;
            }
        }
    }
});


//METHODS FOR OPENING AND CLOSING SIDEBAR

closeSidebar();
function openSidebar() {
    document.getElementById("mySidebar").style.display = "block";
}

function closeSidebar() {
    document.getElementById("mySidebar").style.display = "none";
}

function Sidebar() {
    login.name = '';
    login.password = '';
    document.getElementsByClassName("newpass").item(0).style.display = "none";
    document.getElementsByClassName("newpass").item(1).style.display = "none";
    document.getElementsByClassName("newpass").item(2).style.display = "none";
    document.getElementById("new").innerHTML = "New Profile";
    if (sidebar === true) {
        closeSidebar();
    } else {
        openSidebar();
    }
    sidebar = !sidebar;
}





//LOGIN VUE

//Get user authorization token






var login = new Vue({
    el: '#login',
    data: {
        name: '',
        password: '',
        repassword: ''
    },
    updated: function () {
        console.log('updated... a is: ' + this.a);
    },
    methods: {
        login: function () {
            var getTokenUrl = "http://ec2-34-221-83-233.us-west-2.compute.amazonaws.com:5000/users/authenticate";
            var getToken = new XMLHttpRequest();
            getToken.open("POST", getTokenUrl);
            getToken.setRequestHeader("Content-Type", "application/json");
            getToken.onreadystatechange = function () {
                if (getToken.readyState === 4) {
                    var res = getToken.status;
                    if (res === 400) {
                        document.getElementsByClassName("newpass").item(2).textContent = "Wrong password or Username";
                        document.getElementsByClassName("newpass").item(2).style.display = "flex";
                    } else {
                        document.getElementsByClassName("newpass").item(2).textContent = "";
                        document.getElementsByClassName("newpass").item(2).style.display = "none";
                        var x = getToken.responseText;
                        Token = JSON.parse(x).jwt;
                        console.log(Token);
                        var getNotedUrl = "http://ec2-34-221-83-233.us-west-2.compute.amazonaws.com:5000/api/notes?name";
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", getNotedUrl);
                        xhr.setRequestHeader("Authorization", "Bearer " + Token);
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4) {
                                console.log(xhr.status);
                                data = JSON.parse(xhr.responseText);
                                console.log(data);
                                people = [];
                                data.forEach(function (person) {
                                    people.push((({id, name, text, importance, favourite, colour, font_size, height, width, x_coordinate, y_coordinate}) =>
                                        ({id, name, text, importance, favourite, colour, font_size, height, width, x_coordinate, y_coordinate}))(person));
                                });
                                if (people.length < 3) {
                                    document.getElementById("buffer").style.backgroundColor = "#002e4b";
                                    document.body.style.backgroundImage = "linear-gradient(#002e4b, #002e4b)";
                                }
                                app.posts = people;
                                sidebar = false;
                                closeSidebar();
                            }
                        };
                        xhr.send();
                    }
                }
            };
            var body = `{
  "password": "` + this.password + `",
  "username": "` + this.name + `"
}`;


            getToken.send(body);
        },
        createAccount: function () {
            document.getElementsByClassName("newpass").item(2).style.display = "none";
            if (document.getElementById("new").innerHTML === "New Profile") {
                document.getElementsByClassName("newpass").item(0).style.display = "flex";
                document.getElementsByClassName("newpass").item(1).style.display = "flex";
                document.getElementById("new").innerHTML = "Create Account";
            } else {
                if (this.password !== this.repassword) {
                    document.getElementsByClassName("newpass").item(2).style.display = "flex";
                    document.getElementsByClassName("newpass").item(2).textContent = "Passwords do not match!!";
                } else {
                    document.getElementsByClassName("newpass").item(2).style.display = "none";
                    var getTokenUrl = "http://ec2-34-221-83-233.us-west-2.compute.amazonaws.com:5000/users/create";
                    var getToken = new XMLHttpRequest();
                    getToken.open("POST", getTokenUrl);
                    getToken.setRequestHeader("Content-Type", "application/json");
                    getToken.onreadystatechange = function () {
                        if (getToken.readyState === 4) {
                            var res = getToken.status;
                            var x = getToken.responseText;
                            if (res === 400) {
                                document.getElementsByClassName("newpass").item(2).textContent = x;
                                document.getElementsByClassName("newpass").item(2).style.display = "flex";
                            } else {
                                login.login();
                            }
                        }
                    };
                    var body = `{
  "password": "` + this.password + `",
  "username": "` + this.name + `"
}`;
                    getToken.send(body);
                }
            }
        }
    }
});


