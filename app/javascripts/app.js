// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";
import "../stylesheets/bootstrap-grid.css";
// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import { SHA256 } from "../javascripts/asmcrypto.js";

// Import our contract artifacts and turn them into usable abstractions.
import chainsign_artifacts from '../../build/contracts/ChainSign.json'
import materai_artifacts from '../../build/contracts/DigitalMaterai.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var ChainSign = contract(chainsign_artifacts);
var DigitalMaterai = contract(materai_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var file_hash;
var owner_info;
var use_materai;
var materai_amount;
var address_token_amount;

window.App = {
  start: function() {
    var self = this;
    ChainSign.setProvider(web3.currentProvider);
    DigitalMaterai.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      var addresses = document.getElementById("addresses");
      var index = 0;
      accs.forEach(function(acc){
        var option = document.createElement("option");
        option.value= index;
        option.innerHTML = acc;

        addresses.appendChild(option);
        index++;
      });

      accounts = accs;
      account = accounts[0];

      document.getElementById('form1').reset();
      document.getElementById('by_address').value ='';

      self.refresh_balance();

      //CLEANING UP NEEDED
      function handleFile(){
        var f = document.getElementById("file").files[0]; 

        if (f) {
          var r = new FileReader();
          r.onload = function(e) { 
            var hash_info = document.getElementById('hash_info');
            var contents = e.target.result;
            hash_info.value = "generating document hash..."
            file_hash = "0x" + SHA256.hex(contents);
            //alert(contents);  
            self.show_doc_info();
          }
      
        r.readAsArrayBuffer(f);
        }   
      }

      function changeAddress(){
        var f = document.getElementById("addresses").value; 

        account = accounts[f];
        alert("Account changed to: \n" + account);

        self.refresh_balance();
      }

      document.getElementById('file').addEventListener('change', handleFile, false);
      document.getElementById('addresses').addEventListener('change', changeAddress, false);
    });
  },

  transfer_materai: function(){
    var self = this;
    var target_address = document.getElementById("target_address").value;
    var amount = document.getElementById("amount").value * 1e+18;
    DigitalMaterai.deployed().then(function(instance) {
      return instance.transfer(target_address, amount, {from: account});
    }).then(function(value) {
      self.refresh_balance();
      document.getElementById("transfer_status").innerHTML = "transfer success"
    }).catch(function(e) {
      console.log(e)
      document.getElementById("transfer_status").innerHTML = "transfer failed"
    });
  },

  mint_token: function(){
    var self = this;
   
    DigitalMaterai.deployed().then(function(instance) {
      return instance.mintToken(account, 1000000*1e+18, {from: account});
    }).then(function(value) {
      self.refresh_balance();
    }).catch(function(e) {
      console.log(e)
      alert("not authorized!")
    });
  },

  refresh_balance: function(){
    DigitalMaterai.deployed().then(function(instance) {
      return instance.balanceOf.call(account, {from: account});
    }).then(function(value) {
      document.getElementById("balance").innerHTML = "Materai Owned = Rp" + value.valueOf()/1e+18;
    }).catch(function(e) {
      console.log(e)
    });
  },

  show_doc_info: function(){
    var self = this;
    self.show_doc_hash();
    self.show_doc_owner();
    self.show_doc_registrant();
    self.show_doc_signed();
    self.show_doc_stamped();
  },

  show_doc_owner: function(){
    var self = this;
    var owner_info = document.getElementById('owner_info');
    var target_address = document.getElementById('target_address');
    var transfer_status = document.getElementById('transfer_status');
    ChainSign.deployed().then(function(instance) {
      return instance.get_owner.call(file_hash, {from: account});
    }).then(function(value) {
      if(value.valueOf() == 0){
        owner_info.value = 'none'
      } else {
        owner_info.value = value.valueOf();
      }

      if(account == owner_info.value){
        target_address.readOnly = false;
        transfer_status.innerHTML = "You can transfer the ownership of this document."
      } else {
        target_address.readOnly = true;
        transfer_status.innerHTML = "You must own the document to transfer its ownership."
      }
    }).catch(function(e) {
      console.log(e);
      owner_info.value = 'error';
    });
  },

  show_doc_registrant: function(){
    var self = this;
    var registrant_info = document.getElementById('registrant_info');
    ChainSign.deployed().then(function(instance) {
      return instance.get_registrant.call(file_hash, {from: account});
    }).then(function(value) {
      if(value.valueOf() == 0){
        registrant_info.value = 'none'
      } else {
        registrant_info.value = value.valueOf();
      }
    }).catch(function(e) {
      console.log(e);
      registrant_info.value = 'error';
    });
  },

  show_doc_hash: function(){
    var self = this;
    var hash_info = document.getElementById('hash_info');
    hash_info.value = file_hash;
  },

  set_html_doc_status: function(message){
    var doc_status = document.getElementById("doc_status");
    doc_status.innerHTML = message;
  },

  show_doc_signed: function(){
    var self = this;
    ChainSign.deployed().then(function(instance) {
      return instance.get_signature_block.call(account, file_hash, {from: account});
    }).then(function(value) {
      if(value.valueOf() != 0){
        self.set_html_doc_status('You have signed this document at <b>block ' + value.valueOf() + "</b>");
      } else {
        self.set_html_doc_status('You never signed this document.');
      }
    }).catch(function(e) {
      console.log(e);
      self.set_html_doc_status("error");
    });
  },

  show_doc_stamped: function(){
    DigitalMaterai.deployed().then(function(instance) {
      return instance.readStamped.call(file_hash, {from: account});
    }).then(function(value) {
      if(value.valueOf() != 0){
        document.getElementById('stamped_status').innerHTML = "stamped with materai Rp" + value.valueOf()/1e+18;
      } else {
        document.getElementById('stamped_status').innerHTML = "";
      }
    }).catch(function(e) {
      console.log(e);
      alert("error");
    });
  },

  sign: function(){
    var self = this;
    if(use_materai){
      self.stamp_document();
    }
    self.sign_doc();
  },

  stamp_document: function(){
    var self = this;
    var amount = materai_amount*1e+18;
    DigitalMaterai.deployed().then(function(instance) {
      return instance.stampDocument(file_hash, amount, {from: account});
    }).then(function(value) {
      self.refresh_balance();
      alert("stamping success");
    }).catch(function(e) {
      console.log(e);
      alert("stamping failed");
    });
  },

  sign_doc: function(){
    var self = this;

    ChainSign.deployed().then(function(instance) {
      self.set_html_doc_status("signing...");
      return instance.sign(file_hash, {from: account});
    }).then(function(value) {
      self.show_doc_info();
      alert("signature recorded at: " + value.valueOf().tx);
    }).catch(function(e) {
      console.log(e);
      self.set_html_doc_status("err:<br><br>This address might have been signed this document before.<br>Click <b>`refresh`</b> to see which block");
    });
  },

  transfer_ownership: function(){
    var self = this;
    var target_address = document.getElementById('target_address');
    var transfer_status = document.getElementById('transfer_status');

    ChainSign.deployed().then(function(instance) {
      transfer_status.innerHTML = "transferring...";
      return instance.transfer_ownership(file_hash, target_address.value, {from: account});
    }).then(function(value) {
      self.show_doc_info();
      target_address.value = '';
      alert("transfer success, tx receipt:\n " + value.valueOf().tx);
    }).catch(function(e) {
      console.log(e);
      target_address.value = '';
      transfer_status.innerHTML = "err:<br><br>You must own the document to transfer its ownership.";
    });
  },

  verify_doc: function(){
    var self = this;
    var verify_status = document.getElementById('verify_status');
    var target_address = document.getElementById('by_address').value; //TODO: validate input

    ChainSign.deployed().then(function(instance) {
      verify_status.innerHTML = "verifying..."
      return instance.get_signature_block.call(target_address, file_hash, {from: account});
    }).then(function(value) {
      if(value.valueOf() != 0){
        verify_status.innerHTML = 'This address signed this document at <b>block ' + value.valueOf() + "</b>.";
      } else {
        verify_status.innerHTML = 'This address never signed this document before.';
      }
    }).catch(function(e) {
      console.log(e);
      verify_status.innerHTML = 'error';
    });
  },

  copy_address: function(){
    var value = accounts[document.getElementById("addresses").value];

    var tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  },

  show_hide_materai: function(){
    var f = document.getElementById('use_materai').checked;
    var g = document.getElementById('materai').value;
    if(f){
      document.getElementById('materai').style.display = 'block';
      materai_amount = g;
      console.log(materai_amount);  
    } else {
      document.getElementById('materai').style.display = 'none';
    }
    use_materai = f;
  },

  change_materai_amount: function(){
    materai_amount = document.getElementById('materai').value;
    console.log(materai_amount);
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {

    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
