class CalcController{
    constructor(){

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale='pt-BR';
        this._displayCalcEl = document.querySelector("#display");  // display dos numeros
        this._dateEl = document.querySelector("#data");  // display da data 
        this._timeEl= document.querySelector("#hora"); // display da hora
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }
    
    // Colar na Area de transferencia
    pasteFromClipBoard(){
        document.addEventListener('paste', e =>{
         let text =  e.clipboardData.getData('Text');

          this.displayCalc = parseFloat(text);
          
         console.log(text);

        })

    }

    // Copiar para a Area de transferencia
    copyToClipBoard(){
        let input = document.createElement('input');
        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand('copy');

        input.remove();

    }

    initialize(){

        this.setDisplayDateTime();   // precisou iniciar uma vez antes pois o setinterval somente executa depois de 1s

        setInterval(()=>{

        this.setDisplayDateTime();
    }, 1000);
    // Faz com que o relogio funcione

    // ja inicializa o display com o 0
    this.setLastNumberToDisplay();
    this.pasteFromClipBoard();

    document.querySelectorAll('.btn-ac').forEach(btn =>{
        btn.addEventListener('dblclick', e=>{

            this.toggleAudio();
        });

    });
 
    }

    toggleAudio(){

        this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    initKeyboard(){

        this.playAudio();
        document.addEventListener('keyup', e =>{
            switch(e.key){
                case 'Escape':
                    this.clearAll();
                 break;
     
                 case 'Backspace':
                     this.clearEntry();
                 break; 
                 case '+':                      
                 case '-':         
                 case '*':    
                 case '/':       
                 case '%':
                    this.addOperation(e.key);  
                 break;
                                   
                 case 'Enter':
                 case '=':
                     this.calc();                   
                 break;
          
                 case '.':
                 case ',':
                    this.addDot();
                 break;
     
                 case '0':
                 case '1':
                 case '2':
                 case '3':
                 case '4':
                 case '5':
                 case '6':
                 case '7':
                 case '8':
                 case '9':
                     this.addOperation(parseInt(e.key));
                 break;

                 case 'c':
                     if(e.ctrlKey) this.copyToClipBoard();
   
            }

        });
    }
    // Metodo para limpar tudo
    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();

    }
    // metodo para limpar a ultima operação da tela do display

    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
 
    }

     // metodo que retorna a Ultima Operação
     getLastOperation(){
        return this._operation[this._operation.length - 1];
 
     }
      // definir a Ultima Operacao
     setLastOperation(value){
         this._operation[this._operation.length - 1]= value;

     }

        // metodo que verifica se é ou nao um operador e retorna verdadeiro ou falso
        isOperator(value){
       if(  ['+','-','*','/','%'].indexOf(value) > -1){
           return true;

       }else {
           return false;
       }

     }

     pushOperation(value){
        this._operation.push(value);
         
      if (  this._operation.length > 3 ){
          this.calc();
         
        
        // retira o ultimo elemento e guardo na variavel e o operation so fica com os 3 itens
          console.log(this._operation);

      }
     }

     getResult(){
         try{
            return  eval(this._operation.join(""));
         } catch (e){
             setTimeout(()=>{
                this.setError();
             }, 1);

         }
      

     }

     calc(){
       let last = '';
       this._lastOperator = this.getLastItem();

       if(this._operation.length < 3){
           let firstItem = this._operation[0];
           this._operation = [firstItem, this._lastOperator, this._lastNumber];
       }

        if( this._operation.length > 3 ){
            last = this._operation.pop();

         this._lastNumber = this.getResult();
               
        }
        
        else if(this._operation.length == 3){
        
        this._lastNumber = this.getLastItem(false);
        }

        console.log('_lastOperator',this._lastOperator);
        console.log('_lastNumber',this._lastNumber);
        let result = this.getResult();
        // calculo para a porcentagem ^
        if(last == '%'){
        
           result = (result / 100);
           this._operation = [result];

        } else{
            
            this._operation =[result];
           
            if(last) this._operation.push(last);
        }
        this.setLastNumberToDisplay();
     }

     getLastItem(isOperator = true){
         let lastItem;

         for(let i = this._operation.length - 1 ; i>= 0 ; i --){
              

            if (this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
         
            }
         }

         if(!lastItem){
             lastItem = (isOperator) ? this._lastOperator : this._lastNumber ;
         }
        return lastItem;
     }


     setLastNumberToDisplay(){
         let lastNumber;
          for(let i = this._operation.length - 1 ; i>= 0 ; i --){
              if (!this.isOperator(this._operation[i])){
                  lastNumber = this._operation[i];
                  break;

              }
          }
          if(!lastNumber) lastNumber = 0;

          this.displayCalc = lastNumber;
          
      
     }
    
     // Adicionar Operação
    addOperation(value){
        console.log('A', value , isNaN(this.getLastOperation()));
           if (isNaN (this.getLastOperation())){

               if(this.isOperator(value)){

                  this.setLastOperation(value);
              
                } else if(isNaN(value)){
                 console.log('Outra coisa', value);

                } else {
                    this.pushOperation(value);
                    this.setLastNumberToDisplay();

           }

        } else {
            if(this.isOperator(value)){
                this.pushOperation(value);

            }else{
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                
                this.setLastNumberToDisplay();
            }
    
           }
    }


    setError(){
        this.displayCalc = "ERROR";
    }

    addDot(){
        let lastOperation = this.getLastOperation();
         if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

         if(this.isOperator(lastOperation) || !lastOperation){
             this.pushOperation('0.');
         }else{
             this.setLastOperation(lastOperation.toString() + '.');
         }
            this.setLastNumberToDisplay();
    }

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event =>{
         element.addEventListener(event, fn, false);  // o false serve para abortar um evento caso os dois aconteça simultaneos
    });

}
    
    // metodo que pega as valores dos botoes em formato de string e executa
   execBtn(value){
       this.playAudio();

       switch(value){
           case 'ac':
               this.clearAll();
            break;

            case 'ce':
                this.clearEntry();
            break; 
            
            case 'soma':
                    this.addOperation('+');
            break;
            
            case 'subtracao':
                    this.addOperation('-');
            break;
            
            case 'multiplicacao':
                    this.addOperation('*');
             break;
            
            case 'divisao':
                    this.addOperation('/');
            break;
            
            case 'porcento':
                    this.addOperation('%');
            break;
            
            case 'igual':
                this.calc();                   
            break;
     
            case 'ponto':
                    this.addDot();
            break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
            break;
  
            default:
                this.setError();
                break;

       }
       
   }

    initButtonsEvents(){

      let buttons =  document.querySelectorAll("#buttons > g, #parts > g ");

      // com o metodo foreach serve para percorre e encotrar cada um dos botoes ele vai executar a funcao
      buttons.forEach((btn,index) =>{
       this.addEventListenerAll(btn, "click drag ", e=>{
  // addEvent adiciona o click e o drag ao botao de cada elemento
         let textBtn = btn.className.baseVal.replace("btn-",""); // nesse caso só irar ficar com o numero do botao e o nome das operacoes
         this.execBtn(textBtn);

      }); 
      
      this.addEventListenerAll(btn, "mouseover mouseup mousedown" , e=>{
          btn.style.cursor = "pointer";   // mudara o cursor do mouse para a maozinha
        
      });

    });

}

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {day: "2-digit",
         month: "long",year :"numeric"});
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }
    // Metodo para data e Hora

    get displayTime(){
        return this._timeEl.innerHTML;

    }
    set displayTime(value){
         this._timeEl.innerHTML=value;

    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(value){
         this._dateEl.innerHTML=value;
    }

   get displayCalc(){
       return this._displayCalcEl.innerHTML;
   }

   set displayCalc(value){
    
    if(value.toString().length > 10){
        this.setError();
        return false;
    }
    this._displayCalcEl.innerHTML = value;
}
   get currentDate(){
       return new Date();
   }

   set currentDate(value){
       this._currentDate = value;
   }

}           