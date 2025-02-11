window.gridNum = 3;
window.theme = "minimal";
window.communities=[];
window.communities_info=[];


pullSettings();

function get_user_id(){
    return "user_123";
}

async function pullSettings(){
    let response = await fetch(`http://127.0.0.1:5000/get-settings?userID=${get_user_id()}`,{
        method:'GET',
        mode:"cors",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        })
        let data = await response.json();

        setTheme(data['theme']);
        changeGrid(Number(data['grid']));
        console.log(data);
        setCommunities(data['communities']);
}
        
async function save_settings(){
    let settings = {
        "theme":window.theme,
        "grid":String(window.gridNum),
        "communities":window.communities,
        "userID":get_user_id()
    };
    console.log(settings);
    let response = await fetch(`http://127.0.0.1:5000/save-settings?userID=${get_user_id()}`,{
        method:'POST',
        mode:'cors',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
    }
    );

}

async function setCommunities(communities){
    console.log(communities);
    if(communities){
        for(let i=0;i<=communities.length-1;i++){
            console.log(communities[i]);
            (window.communities).push(communities[i]);
                            
            let response = await fetch(`http://127.0.0.1:5000/get-communities-info?communities=${communities[i]}`,{
                        method:'GET',
                        mode:"cors",
                        headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                                }});

                        let data = await response.json();
                        (window.communities_info).push(data);
        }
    }
    console.log(window.communities_info);
}

async function saveNewTheme(){
    let bgColor = document.getElementById("bg-color").value;
    let textColor = document.getElementById("text-color").value;
    updateCustomColors(bgColor,textColor);

    let newTheme = {
            "backgroundColor": document.documentElement.style.getPropertyValue('--background-color'),
            "headerGradient": document.documentElement.style.getPropertyValue('--header-gradient'),
            "textColor":document.documentElement.style.getPropertyValue('--text-color'),
            "secondaryText": document.documentElement.style.getPropertyValue('--secondary-text'),
            "buttonColor":document.documentElement.style.getPropertyValue('--button-color'),
            "buttonHover": document.documentElement.style.getPropertyValue('--button-hover'),
            "borderColor": document.documentElement.style.getPropertyValue('--border-color'),
            "gridBackground": document.documentElement.style.getPropertyValue('--grid-background'),
            "profile_pic_bg": document.documentElement.style.getPropertyValue('--profile-pic-bg'),
            "userID":get_user_id()
        };

    let response = await fetch('http://127.0.0.1:5000/save-theme',{
            method:'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify(newTheme)});
            window.theme="custom";
}
        
async function pull_Theme(){
    let response = await fetch(`http://127.0.0.1:5000/get-theme?userID=${get_user_id()}`,{
            method:'GET',
            mode:"cors",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }});

    let data = await response.json();
            // console.log(data);

    document.documentElement.style.setProperty('--background-color', data['backgroundColor']);
    document.documentElement.style.setProperty('--text-color', data['textColor']);
    // Update other related colors
    document.documentElement.style.setProperty('--secondary-text',data['secondaryText']);
    document.documentElement.style.setProperty('--border-color', data['borderColor']);
    document.documentElement.style.setProperty('--grid-background', data['gridBackground']);
    document.documentElement.style.setProperty('--profile-pic-bg', data['profile_pic_bg']);
}

//adds new post spot to grid 
function addPost() {
    //appends new html element to grid
    const grid = document.getElementById('postsGrid');
    const newPost = document.createElement('div');
    grid.appendChild(newPost);
    //sets our newly created post to the grid-item class to apply css styling
    newPost.className = 'grid-item';
            
    //update post count in profile numbers
    const postCountElement = document.querySelector('.stat-number');
    const currentCount = parseInt(postCountElement.textContent);
    postCountElement.textContent = currentCount + 1;
}

// change profile photo 
// click on profile pic to upload
document.querySelector('.profile-pic').onclick = () => document.getElementById('profilePicInput').click();

// when the current placeholder changes opens file reader to select new photo
document.getElementById('profilePicInput').onchange = function() {
            //same logic and format as grid post photo upload to store image
            //also uses cssText to center image
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const profilePic = document.querySelector('.profile-pic');
                    profilePic.style.cssText = `
                        background: url(${e.target.result}) center/cover;      
                    `;
                    localStorage.setItem('profilePicture', e.target.result);
                };
                reader.readAsDataURL(file);
            }};

// load the saved profile picture
const savedPic = localStorage.getItem('profilePicture');
if (savedPic) {
    document.querySelector('.profile-pic').style.cssText = `
        background: url(${savedPic}) center/cover;
    `;
}

// open edit panel when u click edit profile
function toggleEditPanel() {
    const panel = document.getElementById('editPanel');
    panel.classList.toggle('open');
    
    // takes you back to the main menu when you close
    if (!panel.classList.contains('open')) {
        closeSubmenu('presetsMenu');
        // added closing for grid submenu as well
        closeSubmenu('gridMenu');
    }
}

// function to get css to change so menu is shown
function openSubmenu(menuId) {
    const submenu = document.getElementById(menuId);
    submenu.classList.add('open');
    createCommunities();
}

// css to change to close menu 
function closeSubmenu(menuId) {
    const submenu = document.getElementById(menuId);
    submenu.classList.remove('open');
}
// end of change profile photo 

// js to set the preset themes - this changes the colors for the elements
function setTheme(theme) {
    // take off all existing theme classes
    document.body.classList.remove('theme-minimal', 'theme-citrus', 'theme-professional', 'theme-space', 'theme-cherryblossom','theme-citybreeze','theme-emeraldsplash','theme-cityofstars','theme-monotone','theme-purplerain');
    
    // add a new theme class if it's not minimal (bc minimal is default)
    if (theme !== 'minimal') {
        document.body.classList.add('theme-' + theme);
    }
    
    // this shows visually that a selection was made
    const presets = document.querySelectorAll('.color-preset');
    presets.forEach(preset => {
        preset.style.border = '1px solid var(--border-color)';
    });
    
    /* makes border HARDER */ 
    const selectedPreset = document.querySelector(`.color-preset[data-theme="${theme}"]`);
    if (selectedPreset) {
        selectedPreset.style.border = '2px solid var(--button-color)';
    }

    if(theme=='custom'){
        pull_Theme();
    }
    window.theme = theme;
}

/* this function changes the frame shape */ 
function setProfileFrame(frameType) {
    // remove all existing frame classes 
    const profilePic = document.querySelector('.profile-pic');
    // frame option types 
    const allFrameTypes = ['circle', 'square'];
    
    allFrameTypes.forEach(type => {
        profilePic.classList.remove(`frame-${type}`);
    });
    
    // add new frame class
    profilePic.classList.add(`frame-${frameType}`);
    
    // update the selection
    const frames = document.querySelectorAll('.frame-option');
    frames.forEach(frame => {
        frame.style.border = '1px solid var(--border-color)';
    });
    
    /* selection border */ 
    const selectedFrame = document.querySelector(`.frame-option[data-frame="${frameType}"]`);
    if (selectedFrame) {
        selectedFrame.style.border = '2px solid var(--button-color)';
    }
}

//function redraw grid layout
function changeGrid(value) {
    const gridSize = value;
    const grid = document.querySelector('.grid');
    
    // change grid layout columns based on selected grid
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    
    // change gap size to fit new grid layout
    if (gridSize === 3) {
        grid.style.gap = '28px';
    } else if (gridSize === 4) {
        grid.style.gap = '20px';
    } else {
        grid.style.gap = '15px';
    }

    window.gridNum = value;

}

//gets the posts array from local storage to display and alter
let posts = JSON.parse(localStorage.getItem('posts')) || [];

        //functions to open and close popup to post
function openAddPostModal() {
    document.getElementById('addPostModal').style.display = 'block';
}

        //clears popup fields
function closeAddPostModal() {
    document.getElementById('addPostModal').style.display = 'none';
    document.getElementById('postTitle').value = '';
    document.getElementById('postImage').value = ''; // Reset image input
}

//createPost now updated to upload image as part of newPost to posts array
function createPost() {
    const title = document.getElementById('postTitle').value;
    const imageFile = document.getElementById('postImage').files[0];

    // converts image to base64 string data
    // stores that into newPost
    const reader = new FileReader();
    reader.onload = function(event) {
        const newPost = {
            title,
            image: event.target.result 
        };
        
        //
        posts.unshift(newPost); // add new post to first index of array
        localStorage.setItem('posts', JSON.stringify(posts)); //stores this array in local storage
        renderPosts(); //updates the webpage
        closeAddPostModal(); //closes out popup
        
        // update post count
        const postCountElement = document.querySelector('.stat-number');
        const currentCount = parseInt(postCountElement.textContent);
        postCountElement.textContent = currentCount + 1;
    };

    // stored data from image now read and turned into image
    reader.readAsDataURL(imageFile);
}

    //updates the grid html element printing out each element of posts from local storage
function renderPosts() {
    const grid = document.getElementById('postsGrid');
    grid.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'grid-item';
        postElement.innerHTML = `<img src="${post.image}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;">`;
        grid.appendChild(postElement);});
}

//initialize posts on page load
document.addEventListener('DOMContentLoaded', renderPosts);

//close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('addPostModal');
    if (event.target === modal) {
        closeAddPostModal();
    }
}

function createCommunities(){
    if(window.communities){
        for(let i=0;i<(window.communities).length;i++) {
            const communityElement = document.createElement('div');
            communityElement.className = 'community-item';

            const community_info = document.createElement('div');
            community_info.className = 'community-info';

            community_name = document.createElement('span');
            community_name.classname="community-name";
            community_name.innerHTML = window.communities[i];

            member_count = document.createElement('span');
            member_count.classname="member-count";

                member_count.innerHTML = `100 members`;
            
            community_info.appendChild(community_name);
            community_info.appendChild(member_count);

            link = document.createElement('a');
            link.className = 'pageLink';
            link.id = `${(window.communities[i])}`;
            link.setAttribute('onclick',`populatePageNum('${window.communities[i]}')`);
             link.href='/managecommunity.html';
            

            button = document.createElement('button');
            button.className="manage-community-btn";
            button.innerHTML = "Manage";
            
            link.appendChild(button);

            
            communityElement.appendChild(community_info);
            communityElement.appendChild(link);

            const communitiesList = document.getElementById("communitiesList");
            communitiesList.appendChild(communityElement);
        }
    }
}

 async function populatePageNum(community_id){
    console.log(`PRINTING: ${community_id}`);

    let community = {
        "community": community_id
    };

    const response = await fetch('http://127.0.0.1:5000/set-page-num',{
        method:'POST',
        mode:'cors',
        headers:{'Content-Type': 'application/json',
                'Accept':'application/json'
        },
        body: JSON.stringify(community)
    });

    const data = await response.json();

    


    
}


        
        // creates a community
async function createCommunity() {
   const communityNameInput = document.getElementById('communityName');
   const communityName = communityNameInput.value.trim();

   const communityMemberInput = document.getElementById('communityMemberNum');
   const communityMemberNum = communityMemberInput.value.trim();

   const communityDescription = document.getElementById('communityDescription');
   const communityDescriptionInput = communityDescription.value.trim();
          
    if (communityName) {
       // new community item
       const communitiesList = document.getElementById('communitiesList');
       const newCommunity = document.createElement('div');
       newCommunity.className = 'community-item';
        // inner html to let me put this info in here
        newCommunity.innerHTML = `
                    <div class="community-info">
                    <span class="community-name">${communityName}</span>
                    <span class="member-count">${communityMemberNum}</span>
                    </div>
                    <a id=${communityName} href="/managecommunity.html">
                    <button class="manage-community-btn" >Manage</button></a>`;
              
        // add to the top
        communitiesList.insertBefore(newCommunity, communitiesList.firstChild);
              
        // empty it
        communityNameInput.value = '';
        (window.communities).push(communityName);
                
        let attributes = {
            "num_followers": communityMemberNum,
            "description":communityDescriptionInput
       }

               let response = await fetch(`http://127.0.0.1:5000/add-community?community=${communityName}`,{
                method:'POST',
                mode:'cors',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify(attributes)
            });
           }
       }
// document.querySelectorAll('.pageLinks').forEach(element.addEventListener('click',populatePageNum(element.id)));


function updateCustomColors(bgColor,textColor) {

    document.documentElement.style.setProperty('--background-color', bgColor);
    document.documentElement.style.setProperty('--text-color', textColor);
    //    // Update other related colors
    document.documentElement.style.setProperty('--secondary-text', adjustColor(textColor, 0.6));
    document.documentElement.style.setProperty('--border-color', adjustColor(textColor, 0.2));
    document.documentElement.style.setProperty('--grid-background', adjustColor(bgColor, 0.95));
    document.documentElement.style.setProperty('--profile-pic-bg', adjustColor(bgColor, 0.9));
    // Remove any active theme classes
    document.body.classList.remove('theme-minimal', 'theme-vibrant', 'theme-professional', 'theme-space');
}

function adjustColor(color, opacity) {
    const r = parseInt(color.substr(1,2), 16);
    const g = parseInt(color.substr(3,2), 16);
    const b = parseInt(color.substr(5,2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}