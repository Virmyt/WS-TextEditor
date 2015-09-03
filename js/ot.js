var OT = function(oldValue, newValue, newPosition, startSelection, endSelection) {
    var self = {};
    self.type='';
    self.oldText='';
    self.newText='';
    self.pos=0;
    self.changeLength=0;

    if(startSelection != endSelection){

    }
    if(oldValue.length > newValue.length) {
        setDeletion();
        self.changeLength = oldValue.length - newValue.length;
        self.pos = newPosition;
        self.text = oldValue.substr(self.pos, self.changeLength);
    } else {
        setInsertion()
        self.changeLength = newValue.length - oldValue.length;
        self.pos = newPosition - self.changeLength;
        self.text = newValue.substr(self.pos, self.changeLength);
    }

    function setDeletion(){
        self.type = 'deletion';
    }
    function setInsertion(){
        self.type = 'insertion';
    }
    log([newPosition, startSelection, endSelection]);
    return self;
};