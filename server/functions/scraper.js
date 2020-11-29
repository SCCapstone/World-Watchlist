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
    getArticles: function(rssFeed, article_info) {
        // let article_info = [];
        // let result2 = convert.xml2json(rssFeed.data, {compact: true, spaces: 4});
        let info2 =  JSON.parse(rssFeed);
        for ( i = 0 ; i < info2.rss.channel.item.length ; ++i ) {
            item = info2.rss.channel.item[i];
            //console.log(info2.rss.channel.item[i]);
            let title = link = description = image = null;
            title = this.getTitle(item);
            link = this.getLink(item);
            description = this.getDesc(item);
            temp = new article(title, description, link);
            article_info.push(temp);
            // links2.push(info2.rss.channel.item[i].link._text);
        }
        return article_info;
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
            //console.log(itemObj);
            return null;
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
            //console.log(itemObj);
            return null;
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
            //console.log(itemObj);
            return null;
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
            //console.log(itemObj);
            return null;
        }
        return image;
    }
};
