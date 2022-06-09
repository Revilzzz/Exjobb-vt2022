var nativeNR = 0;

function addOne() {
    nativeNR = nativeNR + 1;
    document.getElementById("nativeNR").innerHTML = nativeNR;
}

function addTwo() {
nativeNR = nativeNR + 2;
document.getElementById("nativeNR").innerHTML = nativeNR;
}



App = {
    contracts: {},
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },
  
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    loadAccount: async () => {
      // Set the current blockchain account
        web3.eth.getAccounts().then(function(result){
        App.account = result[0];
        console.log(App.account)
        document.getElementById("addr").innerHTML = App.account;
        //web3.eth.sendTransaction({from:"0xd88cd0cD272be45A1d7E0cB7fb7C8C96924A2998", to: "0xc2D5d93945Da5D41F593F05D3920781c792C0918", value: 50})
   })
    },
    loadContract: async () => {
        // Create a JavaScript version of the smart contract
        const todoList = await $.getJSON('TodoList.json')
        App.contracts.TodoList = TruffleContract(todoList)
        App.contracts.TodoList.setProvider(App.web3Provider)
        
        App.todoList = await App.contracts.TodoList.deployed()
    },
    render: async () => {
        if(App.loading){
            return
        }

        App.setLoading(true)
        $('#account').html(App.account)

        //await App.renderTask()

        App.setLoading(false)
    },
    renderTask: async () => {
        // Load the total task count from the blockchain
        const taskCount = await App.todoList.taskCount()
        const $taskTemplate = $('.taskTemplate')

        //Render out each task with a new task template
        for (var i = 1; i <= taskCount; i++){
            //Tetch the task data from the blockchain
            const task = await App.todoList.tasks(i)
            const taskId = task[0].toNumber()
            const taskContent = task[1]
            const taskCompleted = task[2]

            //Create the html for the task
            const $newTaskTemplate = $taskTemplate.clone()
            $newTaskTemplate.find('.content').html(taskContent)
            $newTaskTemplate.find('input')
                            .prop('name', taskId)
                            .prop('checked', taskCompleted)
                            //.on('click', App.toggleCompleted)

            //Put the task in the correct list
            if (taskCompleted){
                $('#completedTaskList').append($newTaskTemplate)
            } else{
                $('#taskList').append($newTaskTemplate)
            }
            $newTaskTemplate.show()
        }
    },
    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        const start = $('#start')
        const qr = $('#qr')
        const addr = $('#addr')
        if (boolean) {
          loader.show()
          content.hide()
          start.hide()
          qr.hide()
          addr.hide()
        } else {
          loader.hide()
          start.show()
          content.hide()
          qr.hide()
          addr.hide()
        }
    },

    loadQR: async () => {
      const start = $('#start')
      const qr = $('#qr')
      start.hide()
      qr.show()
    },

    loadContent: async () => {
      const qr = $('#qr')
      const content = $('#content')
      const addr = $('#addr')
      qr.hide()
      content.show()
      addr.show()
    }
    
}
  $(() => {
    $(window).load(() => {
      App.load()
    })
})

async function send_transaction() {

  var to_send = nativeNR*1000000000000000000;
  console.log(to_send)
  let params = [{
    "to": "0xc2D5d93945Da5D41F593F05D3920781c792C0918",
    "from": "0xd88cd0cD272be45A1d7E0cB7fb7C8C96924A2998",
    //"gas": Number(21000).toString(16), //30400
    //"gasPrice": Number(25000000).toString(16), //10000000000
    "value": Number(to_send).toString(16) // 1 ETH
  }]

  let result = await window.ethereum.request({method: "eth_sendTransaction", params}).catch((err)=>{
    console.log(err)
    alert("Utbetalning misslyckades. Vänligen kontakta personal. Felmeddelande: ", err);
    App.setLoading();
  }).then((result)=>{

    alert("Pant utbetald. Tack för ditt medverkande");
    App.setLoading();
  })

  
}

