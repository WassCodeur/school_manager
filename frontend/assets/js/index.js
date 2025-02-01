const contractAddress = '0xDFC762D7ee023AC20273AFE7D7257e5a982a6984';
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "rollNumber",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "rollDate",
                "type": "uint256"
            }
        ],
        "name": "StudentRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "studentRemoved",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "admin",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "rollNumber",
                "type": "uint256"
            }
        ],
        "name": "getStudentById",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rollNumber",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rollDate",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct SchoolManager.Student",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "studentName",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "rollNumber",
                "type": "uint256"
            }
        ],
        "name": "registerStudent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "rollNumber",
                "type": "uint256"
            }
        ],
        "name": "removeStudent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "students",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "rollNumber",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "rollDate",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];


fetch('./assets/abis/abi.json')
    .then((response) => response.json())
    .then((json) => console.log(json));

let web3;
let schoolManager;

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        schoolManager = new web3.eth.Contract(contractABI, contractAddress);
    } else {
        alert('Please install MetaMask!');
    }
});

document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const rollNumber = document.getElementById('rollNumber').value;
    const accounts = await web3.eth.getAccounts();
    await schoolManager.methods.registerStudent(name, rollNumber).send({ from: accounts[0] });
    alert('Student registered successfully!');
});

document.getElementById('getStudentForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const rollNumber = document.getElementById('getRollNumber').value;
    const student = await schoolManager.methods.getStudentById(rollNumber).call();
    document.getElementById('studentInfo').innerText = `Name: ${student.name}, Roll Number: ${student.rollNumber}, Roll Date: ${new Date(student.rollDate * 1000).toLocaleString()}`;
});

document.getElementById('removeStudentForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const rollNumber = document.getElementById('removeRollNumber').value;
    const accounts = await web3.eth.getAccounts();
    await schoolManager.methods.removeStudent(rollNumber).send({ from: accounts[0] });
    alert('Student removed successfully!');
});