
    const form = document.getElementById('calculatorForm');
    const midtermInput = document.getElementById('midtermNote');
    const finalInput = document.getElementById('finalNote');
    const makeUpInput = document.getElementById('makeUpNote');
    const isAbsentCheckbox = document.getElementById('isAbsent');
    const attendedNoRadio = document.getElementById('attendedNo');
    const resultCard = document.getElementById('result-card');
    

    const midtermError = document.getElementById('midtermError');
    const finalError = document.getElementById('finalError');
    const makeUpError = document.getElementById('makeUpError');
    

    const outputSuccess = document.getElementById('outputSuccess');
    const outputLetter = document.getElementById('outputLetter');
    const outputStatus = document.getElementById('outputStatus');
    const outputExplanation = document.getElementById('outputExplanation');

    function validateInput(inputElement, isRequired, errorElement) {
        const value = inputElement.value.trim();
        errorElement.classList.add('hidden');
        inputElement.classList.remove('error');

        if (isRequired && value === "") {
            
            errorElement.textContent = `${inputElement.previousElementSibling.textContent.split('(')[0].trim()} notu gereklidir.`;
            errorElement.classList.remove('hidden');
            inputElement.classList.add('error');
            return null;
        }

        if (value === "") return null; 

        const score = parseFloat(value);
        
        if (isNaN(score) || score < 0 || score > 100) {
            errorElement.textContent = "Not 0 ile 100 arasında olmalıdır.";
            errorElement.classList.remove('hidden');
            inputElement.classList.add('error');
            return null;
        }

        return score;
    }

    function toggleFinalInput() {
        const makeUp = makeUpInput.value.trim();
        if (makeUp !== "") {
            finalInput.setAttribute('disabled', 'true');
            finalInput.classList.add('opacity-60', 'cursor-not-allowed');
            finalInput.removeAttribute('required'); 
        } else {
            finalInput.removeAttribute('disabled');
            finalInput.classList.remove('opacity-60', 'cursor-not-allowed');
            finalInput.setAttribute('required', 'true');
        }
    }
    
    makeUpInput.addEventListener('input', toggleFinalInput);
    window.addEventListener('load', toggleFinalInput); 

    function determineLetterGrade(score) {
        if (score >= 90) return 'A1';
        if (score >= 80) return 'A2';
        if (score >= 70) return 'B1';
        if (score >= 65) return 'B2';
        if (score >= 60) return 'C';
        return 'UNKNOWN'; 
    }

  
    function calculateGrades(e) {
        e.preventDefault();
        
       
        resultCard.classList.add('hidden');
        document.querySelectorAll('.grade-input').forEach(input => input.classList.remove('error'));
        document.querySelectorAll('.text-red-500.mt-1').forEach(error => error.classList.add('hidden'));

        let finalResult = {
            successScore: 0,
            letterGrade: 'F3',
            status: 'Kaldı',
            explanation: 'Hesaplama yapılmadı.',
            passed: false
        };


        if (isAbsentCheckbox.checked) {
            finalResult.letterGrade = 'F1';
            finalResult.explanation = 'Devam koşulunu sağlamadığı için (Devamsızlık).';
            displayResults(finalResult);
            return;
        }

     
        let hasError = false;
        
  
        const midterm = validateInput(midtermInput, true, midtermError);
        if (midterm === null) hasError = true;

    
        const makeUp = validateInput(makeUpInput, false, makeUpError);
        
        let final = null;
        if (makeUp === null) {
        
            if (!finalInput.hasAttribute('disabled')) {
                final = validateInput(finalInput, true, finalError);
                if (final === null) hasError = true;
            }
        }

        if (hasError) return;

    
        if (attendedNoRadio.checked) {
            finalResult.letterGrade = 'F2';
            finalResult.explanation = 'Dersin devam koşulunu sağladı ancak genel/bütünleme sınavına girmediği için.';
            displayResults(finalResult);
            return;
        }

       
        const examScore = makeUp !== null ? makeUp : final;
        
    
        const successScore = (0.40 * midterm + 0.60 * examScore);
        
        finalResult.successScore = parseFloat(successScore.toFixed(2));
        finalResult.explanation = 'Başarı notu hesaplandı.';

        
        if (examScore < 50) {
            finalResult.letterGrade = 'F3';
            finalResult.explanation = `Sınav Notu (${examScore}) 50'den düşük olduğu için (Koşul i: Sınav Notu < %50).`;
            displayResults(finalResult);
            return;
        }

        
        if (finalResult.successScore < 60) {
            finalResult.letterGrade = 'F3';
            finalResult.explanation = `Ders Başarı Notu (${finalResult.successScore}) 60'dan düşük olduğu için (Koşul ii: Başarı Notu < %60).`;
            displayResults(finalResult);
            return;
        }
        
        
        finalResult.passed = true;
        finalResult.status = 'Geçti';
        finalResult.letterGrade = determineLetterGrade(finalResult.successScore);
        finalResult.explanation = `Tebrikler! Ders başarı notu (${finalResult.successScore}) ve Sınav notu (${examScore}) geçme koşullarını sağlamaktadır.`;
        
        displayResults(finalResult);
    }
    

    function displayResults(result) {
        resultCard.classList.remove('hidden');
        
        
        if (result.passed) {
            resultCard.classList.remove('status-failed');
            resultCard.classList.add('status-passed');
            outputStatus.classList.remove('text-red-700');
            outputStatus.classList.add('text-green-700');
            outputLetter.classList.remove('text-red-600');
            outputLetter.classList.add('text-green-600');
        } else {
            resultCard.classList.remove('status-passed');
            resultCard.classList.add('status-failed');
            outputStatus.classList.remove('text-green-700');
            outputStatus.classList.add('text-red-700');
            outputLetter.classList.remove('text-green-600');
            outputLetter.classList.add('text-red-600');
        }

        
        outputSuccess.textContent = result.successScore.toFixed(2);
        outputLetter.textContent = result.letterGrade;
        outputStatus.textContent = result.status;
        outputExplanation.textContent = result.explanation;


        resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    
    
    function resetForm() {
        form.reset();
        resultCard.classList.add('hidden');
        document.querySelectorAll('.grade-input').forEach(input => {
            input.classList.remove('error');
            input.removeAttribute('disabled');
        });
        document.querySelectorAll('.text-red-500.mt-1').forEach(error => error.classList.add('hidden'));
        finalInput.setAttribute('required', 'true');
        finalInput.classList.remove('opacity-60', 'cursor-not-allowed');
    }

    
    form.addEventListener('submit', calculateGrades);
    
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.type !== 'textarea') {
            e.preventDefault(); 
            document.getElementById('calculateBtn').click();
        }
    });