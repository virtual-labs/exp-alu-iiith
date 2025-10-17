The aim of this experiment is to understand and implement an Arithmetic Logic Unit (ALU) - a fundamental component that performs arithmetic and logical operations in digital systems.

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
- **Design and analyze** a programmable 1-bit ALU with multiple function capabilities
- **Implement various operations** including arithmetic (addition, subtraction) and logical operations (AND, OR, XOR, NOT)
- **Explore function selection** using control signals and multiplexer-based operation switching
- **Build complete ALU systems** that form the foundation of processor arithmetic units
- **Connect theoretical MUX understanding** to practical ALU implementation and operation

### ALU Symbol and Interface:

<img src="images/ALU_symbol.png" alt="ALU Symbol" style="width: 100%; max-width: 400px; margin: 10px 0;">

**Input and Output Definitions:**

- **A, B**: Data input operands (the two values to be operated on)
- **F**: Function select inputs (control signals that determine which operation to perform)
- **R**: Result output (the output of the selected arithmetic or logical operation)
- **D**: Additional control or status signals (such as carry, overflow, or zero flags)

### Operations Performed:

Most ALUs can perform the following operations:

- **Bitwise logic operations**: AND, NOT, OR, XOR for Boolean algebra
- **Integer arithmetic operations**: Addition, subtraction, and sometimes multiplication and division
- **Bit-shifting operations**: Shifting or rotating data by specified positions (equivalent to multiplication/division by powers of 2)
- **Comparison operations**: Equality checks and magnitude comparisons

### Why are ALUs important?

ALUs are the computational heart of digital systems. They are essential components in central processing units (CPUs), microprocessors, and digital signal processors. Every arithmetic calculation, logical decision, and data manipulation performed by a computer passes through an ALU.

Understanding ALU design provides insight into how computers perform their fundamental computational operations and forms the basis for understanding processor architecture. The multiplexer-based function selection mechanism in ALUs demonstrates how a single circuit can perform multiple operations efficiently, making it a perfect example of how simpler digital components (like MUXes) combine to create more complex computational units.
