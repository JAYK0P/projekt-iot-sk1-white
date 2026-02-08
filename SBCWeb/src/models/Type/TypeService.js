const Type = require('./Type');
const TypeRepository = require('./TypeRepository');

class TypeService{
    static createType(data){
        
        if(!data.type || data.type.trim() === ''){
            throw new Error('Název typu je povinné pole.');  
        }
        
        if(TypeRepository.findByName(data.type)){
            throw new Error('Tento typ již existuje.');  
        }

        const type = new Type({
            type: data.type 
        });
        
        const dbData = type.toDatabase();

        const result = TypeRepository.create(dbData);
        // result může být objekt nebo číslo -> zjistit id podobně jako u MCUService
        const newId = result && (result.lastID || result.id || result) ;
        type.id = newId;

        return type;
    }

    
    static getAllTypes(){
        return TypeRepository.findAll();
    }

}


module.exports = TypeService;


















