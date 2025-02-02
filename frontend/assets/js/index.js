// const contractAddress = '0xDFC762D7ee023AC20273AFE7D7257e5a982a6984';
const contractAddress = '0x45f30aFEc1e54F92D73985178F2DD0e30Ccbdb89';

let contractABI;

let web3;
let schoolManager;


window.addEventListener('load', async () => {
    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            contractABI = await fetch('./assets/abis/abi.json').then((response) => response.json());
            schoolManager = new web3.eth.Contract(contractABI, contractAddress);
        } catch (error) {
            alert('Error: ' + error);
        }
    } else {
        alert('Please install MetaMask!');
    }
});

document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const name = document.getElementById('name').value;
        const rollNumber = document.getElementById('rollNumber').value;
        const accounts = await web3.eth.getAccounts();
        await schoolManager.methods.registerStudent(name, rollNumber).send({ from: accounts[0] });
        alert('Student registered successfully!');

    } catch (error) {
        if (error.message.includes('Student already registered') || error.message.includes('User denied transaction signature')) {
            alert('Student already registered!');
        } else {
            alert('Error: ' + error);
        }

    }
});

document.getElementById('getStudentForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        event.preventDefault();
        const rollNumber = document.getElementById('getRollNumber').value;
        const rollNumberStr = rollNumber.toString();

        const student = await schoolManager.methods.getStudentById(rollNumberStr).call();
        const studentRoolNumber = parseInt(student.rollNumber);
        const studentRollDate = parseInt(student.rollDate);

        document.getElementById('studentInfo').innerText = `Name: ${student.name}, Roll Number: ${studentRoolNumber}, Roll Date: ${new Date(studentRollDate * 1000)}`;
    } catch (error) {
        if (error.message.includes('Student not registered') || error.message.includes('User denied transaction signature') || error.message.includes('Internal JSON-RPC error')) {
            alert('Student not registered!');
        } else {
            alert('Error: ' + error);
        }


    }
});

document.getElementById('removeStudentForm').addEventListener('submit', async (event) => {
    try {
        event.preventDefault();
        const rollNumber = document.getElementById('removeRollNumber').value;
        const accounts = await web3.eth.getAccounts();
        await schoolManager.methods.removeStudent(rollNumber).send({ from: accounts[0] });
        alert('Student removed successfully!');
    } catch (error) {
        if (error.message.includes('Student not registered') || error.message.includes('User denied transaction signature')) {
            alert('Student not registered!');
        } else {
            alert('Error: ' + error);
        }
    }
});