The aim of this experiment is to design and verify a programmable 1-bit Arithmetic Logic Unit (ALU) that performs addition, AND, OR and XOR on two 1-bit operands, with the operation chosen by two select lines S₁S₀ through a 4-to-1 multiplexer.

### Prerequisites:

Before attempting this experiment, you should have completed and understood:

- **Multiplexer (MUX) Experiment**: Essential understanding of how multiplexers work, including signal selection based on control inputs and internal signal flow. This knowledge is crucial as the ALU heavily relies on multiplexer operation for function selection.
- **Basic Logic Gates**: Understanding of fundamental gates (AND, OR, NOT, XOR) and their truth tables
- **Full Adder Circuits**: Knowledge of addition circuits and carry propagation

**Note**: The multiplexer experiment is particularly important as this ALU uses a 4-to-1 MUX for operation selection, and understanding internal MUX signal flow will help you better comprehend the ALU's function selection mechanism.

### What you will learn:

Through this interactive experiment, you will:

- **Understand the fundamentals** of ALU design and operation in digital circuits
- **Apply multiplexer knowledge** to understand how control signals select different ALU operations
- **Design and analyze** a programmable 1-bit ALU with four functions
- **Implement four operations**: one arithmetic operation (addition, using a full adder) and three logical operations (AND, OR, XOR)
- **Explore function selection** using the select lines S₁S₀ and multiplexer-based operation switching
- **Verify the ALU** by comparing its output F and carry output Cout with the expected truth table
- **Connect theoretical MUX understanding** to practical ALU implementation and operation
- **See how a 1-bit ALU is extended** to a multi-bit ALU (this extension is described in the theory but not built in the experiment)

### ALU Symbol and Interface:

<img src="images/ALU_symbol.png" alt="ALU Symbol" style="width: 100%; max-width: 400px; margin: 10px 0;">

**Input and Output Definitions:**

- **A, B**: Data input operands (the two values to be operated on)
- **F**: Function select inputs (control signals that determine which operation to perform)
- **R**: Result output (the output of the selected arithmetic or logical operation)
- **D**: Output status signals (such as carry, overflow, or zero flags)

**In this experiment** the symbol is used with the following names, which are also the names on the simulation pages: the operands are **A** and **B**, the carry input is **Cin**, the function select lines are **S₁** and **S₀**, the result is **F** (shown as "Output" in the Practice task) and the status output is the carry **Cout**.

### Operations Performed:

Most ALUs can perform the following operations (the ALU of this experiment performs only addition, AND, OR and XOR):

- **Bitwise logic operations**: AND, NOT, OR, XOR for Boolean algebra
- **Integer arithmetic operations**: Addition, subtraction, and sometimes multiplication and division
- **Bit-shifting operations**: Shifting or rotating data by specified positions (equivalent to multiplication/division by powers of 2)
- **Comparison operations**: Equality checks and magnitude comparisons

### Why are ALUs important?

ALUs are the computational heart of digital systems. They are essential components in central processing units (CPUs), microprocessors, and digital signal processors. Every arithmetic calculation, logical decision, and data manipulation performed by a computer passes through an ALU.

Understanding ALU design provides insight into how computers perform their fundamental computational operations and forms the basis for understanding processor architecture. The multiplexer-based function selection mechanism in ALUs demonstrates how a single circuit can perform multiple operations efficiently, making it a perfect example of how simpler digital components (like MUXes) combine to create more complex computational units.
