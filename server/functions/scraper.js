function article(title, description, link, image) {
    this.title = title;
    this.description = description;
    this.link = link;
    this.image = image;
}

// exporting functions and constructor
module.exports = {

    article,

    removeEntries: function(list) {
        for( i = 0 ; i < list.length ; ++i ) {
            if (list[i].includes("puzzle") ||
            list[i].includes("crossword")) {
                list.pop
            }
        }
    },
    getArticles: function(rssFeed) {
        
    },
    getRSS: function(rssFeed) {
        
    },

    getTitle: function(itemObj) {
        let title = null;
        if ( "title" in itemObj ) // check if item has title
            itemObj = itemObj["title"];
        if( "_text" in itemObj) { // check item's child
            title = itemObj._text;
        } else if ( "_cdata" in itemObj) {
            title = itemObj._cdata;
        } 
        else {
            console.log(itemObj);
        }
        return title;
    },
    getLink: function(itemObj) {
        let link = null;
        if ( "link" in itemObj)
            itemObj = itemObj["link"];
        if( "_text" in itemObj) { // check item's child
            link = itemObj._text;
        } else if ( "_cdata" in itemObj) {
            link = itemObj._cdata;
        } else {
            console.log(itemObj);
        }
        return link;
    },
    getDesc: function(itemObj) {
        let description = null;
        if ("description" in itemObj)
            itemObj = itemObj["description"];
        if( "_text" in itemObj) { // check item's child
            description = itemObj._text;
        } else if ( "_cdata" in itemObj) {
            description = itemObj._cdata;
        } else {
            console.log(itemObj);
        }
        return description;
    },

    getImage: function(itemObj) {
        let image = null;
        if ( "media:content" in itemObj) {
            itemObj = itemObj["media:content"];
        } else if ("media:thumbnail" in itemObj) {
            itemObj = itemObj["media:thumbnail"];
        }
        if ( "image" in itemObj) {
            image = itemObj["image"];
        } else if ("") {

        } else {
            console.log(itemObj);
        }
        return image;
    }
};


// axios.get('').then(
//   (response) => {
//     // console.log(response);
//     // console.log(response.data);
//     let result2 = convert.xml2json(response.data, {compact: true, spaces: 4});
//     // console.log(result2);
//     let info2 = JSON.parse(result2)
//     // console.log(info2.rss.channel.item)
//     for ( i = 0 ; i < info2.rss.channel.item.length ; ++i ) {
//       item = info2.rss.channel.item[i];
//       console.log(info2.rss.channel.item[i]);
//       let title = link = description = image = null;
//       title = getTitle(item);
//       link = getLink(item);
//       description = getDesc(item);
//       image = getImage(item);
//       temp = new article(title, description, link, image);
//       article_info.push(temp);
//       links2.push(info2.rss.channel.item[i].link._text);
//     }
//     console.log(article_info);
//     // console.log(links2);
//   }).catch((error) => {
//     console.log(error);
//   })
